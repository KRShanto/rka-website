import { CalendarIcon } from "lucide-react";

const notices = [
  {
    title: "Club Re-open",
    date: "2025-04-06",
    description: "All Branch of BWKD Will Open on 6th April of 2025",
    location: "All Branch",
  },
  {
    title: "Eid Mubarok ",
    date: "2025-03-30",
    description: "Eid Mubarok To All the Students And Perants  Of BWKD ",
  },
  {
    title: "Eid Vacation ",
    date: "2025-03-29",
    description: "All The Branch Of BWKD Is Closed For Eid ul Fitr.",
    location: "All Branch",
  },
  {
    title: "Belt Ceremony",
    date: "2025-03-02",
    description:
      "Results Of The Previous Exam Been Published And The Belt Giving Ceremony Has Been Held , In That Event Chefe Guest Was Abduul Sukkur Ali Shikder",
    location: "Aftabnagor Branch, Dhaka",
  },
  {
    title: "Belt Ceremony",
    date: "2025-03-01",
    description:
      "Results Of The Previous Exam Been Published And The Belt Giving Ceremony Has Been Held , In That Event Chef Guest Was Abduul Sukkur Ali Shikder",
    location: "Bansree Branch",
  },
];

export default function Notice() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Notices & Events
          </h1>
          <p className="text-xl">
            Stay updated with the latest news and upcoming events at BWKD
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {notices.map((notice) => (
              <div
                key={notice.title}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {notice.title}
                    </h2>
                    <div className="flex items-center text-primary dark:text-primary-foreground">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      <span>{notice.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {notice.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Location: {notice.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
