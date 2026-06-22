export interface GithubWrappedData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  
  // Custom processed stats
  languages: { name: string; percentage: number; color: string }[];
  activityHours: {
    morning: number;   // 05:00 - 11:59
    afternoon: number; // 12:00 - 16:59
    evening: number;   // 17:00 - 20:59
    night: number;     // 21:00 - 04:59
  };
  stats: {
    totalStars: number;
    totalForks: number;
    estimatedCommits: number;
    longestStreak: number;
  };
  persona: {
    title: string;
    description: string;
    badge: string;
    colorClass: string;
  };
  isDemo?: boolean;
}

// Map common languages to colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
};

const DEFAULT_COLOR = "#94a3b8"; // slate-400

const CACHE_EXPIRY = 60 * 60 * 1000; // 1 Hour in milliseconds

export async function fetchGithubWrapped(username: string): Promise<GithubWrappedData> {
  const normalizedUsername = username.trim().toLowerCase();
  
  // Try to read from localStorage cache first
  const cached = localStorage.getItem(`wrapped_${normalizedUsername}`);
  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    } catch (e) {
      console.warn("Failed to parse cached data", e);
    }
  }

  // 1. Fetch User Profile
  const userRes = await fetch(`https://api.github.com/users/${username}`);
  if (userRes.status === 404) {
    throw new Error("Username GitHub tidak ditemukan!");
  }
  if (!userRes.ok) {
    throw new Error("Gagal mengambil data profil dari GitHub API. Kemungkinan rate limit tercapai.");
  }
  const user = await userRes.json();

  // 2. Fetch Repositories (Up to 100)
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
  let repos: any[] = [];
  if (reposRes.ok) {
    repos = await reposRes.json();
  }

  // 3. Fetch Recent Events (Up to 100)
  const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
  let events: any[] = [];
  if (eventsRes.ok) {
    events = await eventsRes.json();
  }

  // Process Language distribution
  const langCounts: Record<string, number> = {};
  let totalReposWithLang = 0;
  let totalStars = 0;
  let totalForks = 0;

  repos.forEach((repo: any) => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      totalReposWithLang++;
    }
  });

  const languages = Object.entries(langCounts)
    .map(([name, count]) => ({
      name,
      percentage: totalReposWithLang > 0 ? Math.round((count / totalReposWithLang) * 100) : 0,
      color: LANGUAGE_COLORS[name] || DEFAULT_COLOR,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // If no languages, add a fallback
  if (languages.length === 0) {
    languages.push({ name: "Markdown / Text", percentage: 100, color: DEFAULT_COLOR });
  }

  // Process Activity times from events
  const activityHours = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  let eventCount = 0;

  events.forEach((event: any) => {
    if (event.created_at) {
      const date = new Date(event.created_at);
      const hour = date.getHours();
      eventCount++;

      if (hour >= 5 && hour < 12) {
        activityHours.morning++;
      } else if (hour >= 12 && hour < 17) {
        activityHours.afternoon++;
      } else if (hour >= 17 && hour < 21) {
        activityHours.evening++;
      } else {
        activityHours.night++;
      }
    }
  });

  // Calculate percentages for activity times
  const totalEvents = eventCount || 1; // avoid divide by zero
  const activityPercentages = {
    morning: Math.round((activityHours.morning / totalEvents) * 100),
    afternoon: Math.round((activityHours.afternoon / totalEvents) * 100),
    evening: Math.round((activityHours.evening / totalEvents) * 100),
    night: Math.round((activityHours.night / totalEvents) * 100),
  };

  // Adjust total commits estimate
  const estimatedCommits = (user.public_repos * 12) + (eventCount * 3) + Math.round(totalStars * 1.5);

  // Determine Coding Persona
  let persona = {
    title: "The Lone Wolf Coder",
    description: "Kamu berkarya dalam sunyi, membangun proyek keren satu per satu dengan dedikasi tinggi.",
    badge: "🐺 Lone Wolf",
    colorClass: "from-slate-500 to-zinc-700",
  };

  const topLanguage = languages[0]?.name || "";
  const nightPercentage = activityPercentages.night;
  const morningPercentage = activityPercentages.morning;

  if (totalStars > 50) {
    persona = {
      title: "The Rising Star Developer",
      description: "Kode yang kamu tulis bersinar! Proyekmu diakui oleh komunitas global dengan banyak bintang.",
      badge: "⭐ Rising Star",
      colorClass: "from-amber-400 to-orange-500",
    };
  } else if (languages.length >= 4) {
    persona = {
      title: "The Polyglot Architect",
      description: "Bahasa pemrograman bukan masalah bagimu. Kamu menguasai berbagai bahasa untuk memecahkan masalah.",
      badge: "🌐 Polyglot",
      colorClass: "from-teal-400 to-emerald-600",
    };
  } else if (nightPercentage > 40) {
    persona = {
      title: "The Midnight Sorcerer",
      description: "Saat dunia tertidur, energimu justru bangkit. Kamu menyihir baris-baris kode di tengah malam sunyi.",
      badge: "🌙 Midnight Owl",
      colorClass: "from-indigo-600 to-purple-900",
    };
  } else if (morningPercentage > 40) {
    persona = {
      title: "The Sunrise Champion",
      description: "Mulai pagi hari dengan kopi hangat dan keyboard menyala. Kamu menyelesaikan tugas sebelum siang tiba.",
      badge: "☀️ Early Bird",
      colorClass: "from-yellow-400 to-red-500",
    };
  } else if (topLanguage === "TypeScript" || topLanguage === "Rust" || topLanguage === "Go") {
    persona = {
      title: "The Type Safety Guardian",
      description: "Error di runtime adalah musuh utamamu. Kamu selalu membentengi kodemu dengan tipe data yang kuat.",
      badge: "🛡️ Safe Guard",
      colorClass: "from-blue-500 to-indigo-600",
    };
  }

  const result: GithubWrappedData = {
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
    bio: user.bio || "Developer GitHub yang misterius namun penuh karya.",
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    createdAt: new Date(user.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long" }),
    languages,
    activityHours: activityPercentages,
    stats: {
      totalStars,
      totalForks,
      estimatedCommits: estimatedCommits || 42,
      longestStreak: Math.max(7, Math.min(30, Math.round(eventCount / 4))),
    },
    persona,
  };

  // Cache to localStorage
  localStorage.setItem(
    `wrapped_${normalizedUsername}`,
    JSON.stringify({ timestamp: Date.now(), data: result })
  );

  return result;
}

// Generate Realistic Mock Data for Demo
export function getDemoData(username: string = "koding_expert"): GithubWrappedData {
  return {
    username,
    name: "Emzy Jeppp",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    bio: "Building aesthetic web interfaces | Full-stack wizard & UI Explorer",
    followers: 1248,
    following: 412,
    publicRepos: 48,
    createdAt: "Maret 2021",
    languages: [
      { name: "TypeScript", percentage: 48, color: LANGUAGE_COLORS["TypeScript"] },
      { name: "JavaScript", percentage: 28, color: LANGUAGE_COLORS["JavaScript"] },
      { name: "CSS", percentage: 14, color: LANGUAGE_COLORS["CSS"] },
      { name: "Rust", percentage: 8, color: LANGUAGE_COLORS["Rust"] },
      { name: "HTML", percentage: 2, color: LANGUAGE_COLORS["HTML"] },
    ],
    activityHours: {
      morning: 15,
      afternoon: 25,
      evening: 22,
      night: 38,
    },
    stats: {
      totalStars: 342,
      totalForks: 89,
      estimatedCommits: 1420,
      longestStreak: 18,
    },
    persona: {
      title: "The Midnight Sorcerer",
      description: "Saat dunia tertidur, energimu justru bangkit. Kamu menyihir baris-baris kode di tengah malam sunyi.",
      badge: "🌙 Midnight Owl",
      colorClass: "from-indigo-600 to-purple-900",
    },
    isDemo: true,
  };
}
