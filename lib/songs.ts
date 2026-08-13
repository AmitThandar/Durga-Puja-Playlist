export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  src: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

// NOTE: audio + cover files are placeholders. Drop matching files into
// public/audio/<playlist-id>/ and public/covers/ using the same file names
// referenced below, or edit the paths here once you have the real assets.

const cover = (id: string) => `/covers/${id}.jpg`;
const audio = (playlistId: string, n: number) =>
  `/audio/${playlistId}/track-${String(n).padStart(2, "0")}.mp3`;

export const playlists: Playlist[] = [
  {
    id: "sonali-sondhya",
    name: "সোনালী সন্ধ্যা",
    tracks: [
      "গোল্ড প্রিন্টের শাড়ি পরে গড়িয়া",
      "এবার পুজোয় চাই আমার বেনারসি",
      "আর কত রাত একা থাকবো",
      "এমন মধুর সন্ধ্যায় একা কি থাকা যায়",
      "এক ঝাঁক পাখি আর একরাশ ফুল",
      "এই সুন্দর স্বর্ণালী সন্ধ্যায়",
      "ও তোমারই চলার পথে দিয়ে যেতে",
      "তোমার বাড়ির সামনে দিয়ে আমার",
      "আমি খোলা জানালা তুমি ওই",
      "ভালো লাগছে ভালো লাগছে",
    ].map((title, i) => ({
      id: `sonali-sondhya-${i + 1}`,
      title,
      artist: "শিল্পী অজানা",
      album: "সোনালী সন্ধ্যা",
      cover: cover("sonali-sondhya"),
      src: audio("sonali-sondhya", i + 1),
    })),
  },
  {
    id: "srabon",
    name: "শ্রাবণের গান",
    tracks: [
      "বধুয়া রিমিঝিমি এই শ্রাবণে",
      "বন্ধ মনের দুয়ার দিয়েছি খুলে",
      "চোখে চোখে কথা বলো",
      "একটু বসো চলে যেওনা",
      "কথা হয়েছিল তবু কথা হল না",
      "মহুয়ায় জমেছে আজ মৌ গো",
      "ফুলে গন্ধ নেই সে তো ভাবতে",
      "সন্ধ্যাবেলায় তুমি আমি বসে",
      "চলে যেতে যেতে ডুবে গেল",
      "আজ হৃদয়ে ভালবেসে লিখে",
    ].map((title, i) => ({
      id: `srabon-${i + 1}`,
      title,
      artist: "শিল্পী অজানা",
      album: "শ্রাবণের গান",
      cover: cover("srabon"),
      src: audio("srabon", i + 1),
    })),
  },
  {
    id: "dugga-alo",
    name: "দুর্গা আলো",
    tracks: [
      "শিশিরে শিশিরে শারদ আকাশে",
      "দুর্গে দুর্গে দুর্গতিনাশিনী",
      "বাজলো তোমার আলোর বেণু",
      "জাগো মা দুর্গা",
      "ওগো আমার আগমনী",
      "যা দেবী সর্বভূতেষু",
      "আজি শঙ্খে শঙ্খে মঙ্গল",
      "জাগো তুমি জাগো",
      "জয় জয় জপ্য জয়",
      "আইলো উমা বাড়িতে",
      "শিউলি ফুলের নোলক দেব",
      "বলো দুগ্গা এলো",
      "উমা আসে নতুন সাজে",
      "ও মেনোকা ও মেনোকা",
      "ঢাক বাজা কাসর বাজা",
      "বছর বছর আসতে হবে তোমায় দুর্গা মা",
      "আমার দুর্গা",
      "দুগ্গা মা এসেছে",
    ].map((title, i) => ({
      id: `dugga-alo-${i + 1}`,
      title,
      artist: "শিল্পী অজানা",
      album: "দুর্গা আলো",
      cover: cover("dugga-alo"),
      src: audio("dugga-alo", i + 1),
    })),
  },
];

export const allTracks: Track[] = playlists.flatMap((p) => p.tracks);
