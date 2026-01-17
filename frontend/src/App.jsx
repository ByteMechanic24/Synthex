import { useState } from "react";
import { useResearchStream } from "./hooks/useResearchStream";
import Masthead from "./components/Masthead";
import TopicForm from "./components/TopicForm";
import StageTicker from "./components/StageTicker";
import StageTracker from "./components/StageTracker";
import ReportArticle from "./components/ReportArticle";
import CriticPanel from "./components/CriticPanel";
import Footer from "./components/Footer";

export default function App() {
  const { stages, ticker, isRunning, error, start } = useResearchStream();
  const [topic, setTopic] = useState("");

  const report = stages.writer.data;
  const feedback = stages.critic.data;

  const handleSubmit = (t) => {
    setTopic(t);
    start(t);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <TopicForm onSubmit={handleSubmit} isRunning={isRunning} />
      <StageTicker items={ticker} isRunning={isRunning} />
      <StageTracker stages={stages} />

      {error && (
        <div className="max-w-screen-xl mx-auto w-full px-4 py-6">
          <div className="border border-accent text-accent font-mono text-sm px-4 py-3">
            {error}
          </div>
        </div>
      )}

      {report && (
        <main className="max-w-screen-xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 border-x-0 lg:border-x border-ink flex-1">
          <div className="lg:col-span-8 border-b lg:border-b-0 border-ink">
            <ReportArticle report={report} topic={topic} />
          </div>
          <div className="lg:col-span-4">
            {feedback ? (
              <CriticPanel feedback={feedback} />
            ) : (
              <div className="h-full flex items-center justify-center p-8 border-t lg:border-t-0 lg:border-l border-ink">
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                  Awaiting editor&rsquo;s review&hellip;
                </p>
              </div>
            )}
          </div>
        </main>
      )}

      {!report && !isRunning && (
        <div className="max-w-screen-xl mx-auto w-full px-4 py-24 text-center flex-1">
          <p className="font-serif text-3xl text-neutral-400">
            &#x2727; &#x2727; &#x2727;
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mt-4">
            Assign a story above to start the presses
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
