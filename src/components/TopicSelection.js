// import { Heart, Cpu, FlaskConical, BookOpen } from "lucide-react";

// const topics = [
//   {
//     id: "wellness",
//     name: "Wellness",
//     description: "Health, mindfulness, and personal well-being",
//     icon: "heart",
//   },
//   {
//     id: "tech",
//     name: "Tech Trends",
//     description: "Latest technology and innovation topics",
//     icon: "cpu",
//   },
//   {
//     id: "science",
//     name: "Science",
//     description: "Scientific discoveries and concepts",
//     icon: "flask",
//   },
//   {
//     id: "history",
//     name: "History",
//     description: "Historical events and figures",
//     icon: "book",
//   },
// ];

// const iconMap = {
//   heart: Heart,
//   cpu: Cpu,
//   flask: FlaskConical,
//   book: BookOpen,
// };

// export function TopicSelection({ onSelectTopic }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
//       <div className="max-w-4xl w-full">
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-slate-900 mb-3">
//             AI Knowledge Quiz
//           </h1>
//           <p className="text-lg text-slate-600">
//             Choose a topic to test your knowledge with AI-generated questions
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {topics.map((topic) => {
//             const Icon = iconMap[topic.icon];
//             return (
//               <button
//                 key={topic.id}
//                 onClick={() => onSelectTopic(topic)}
//                 className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-left group border-2 border-transparent hover:border-blue-500"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-500 transition-colors duration-300">
//                     <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
//                       {topic.name}
//                     </h3>
//                     <p className="text-slate-600 leading-relaxed">
//                       {topic.description}
//                     </p>
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>

//         <div className="mt-12 text-center text-sm text-slate-500">
//           <p>Powered by AI • 5 questions per quiz</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  Brain,
  Cpu,
  FlaskConical,
  Heart,
  Leaf,
  BookOpen,
  BarChart3,
  Palette,
  Globe,
} from "lucide-react";

const topics = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    description: "Concepts, applications, and ethics in AI systems",
    icon: "brain",
  },
  {
    id: "tech",
    name: "Technology & Innovation",
    description: "Modern inventions, digital systems, and trends",
    icon: "cpu",
  },
  {
    id: "science",
    name: "Science & Research",
    description: "Discoveries, experiments, and real-world breakthroughs",
    icon: "flask",
  },
  {
    id: "wellness",
    name: "Health & Wellness",
    description: "Human biology, nutrition, and mental well-being",
    icon: "heart",
  },
  {
    id: "environment",
    name: "Environment & Sustainability",
    description: "Climate, renewable energy, and conservation",
    icon: "leaf",
  },
  {
    id: "history",
    name: "History & Civilization",
    description: "Historic events, empires, and key milestones",
    icon: "book",
  },
  {
    id: "business",
    name: "Business & Economics",
    description: "Startups, markets, and global finance concepts",
    icon: "bar",
  },
  {
    id: "art",
    name: "Art & Culture",
    description: "Creativity, famous artists, and cultural traditions",
    icon: "palette",
  },
  {
    id: "gk",
    name: "General Knowledge",
    description: "World affairs, logic, and trivia across domains",
    icon: "globe",
  },
];

const iconMap = {
  brain: Brain,
  cpu: Cpu,
  flask: FlaskConical,
  heart: Heart,
  leaf: Leaf,
  book: BookOpen,
  bar: BarChart3,
  palette: Palette,
  globe: Globe,
};

export function TopicSelection({ onSelectTopic }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-3">
            AI Knowledge Quiz
          </h1>
          <p className="text-lg text-slate-600">
            Choose a topic to test your knowledge with AI-generated questions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const Icon = iconMap[topic.icon];
            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-left group border-2 border-transparent hover:border-violet-500"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-violet-100 p-4 rounded-xl group-hover:bg-violet-500 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-violet-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                      {topic.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          <p>5 questions per quiz</p>
        </div>
      </div>
    </div>
  );
}
