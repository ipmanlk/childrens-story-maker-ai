import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaLightbulb, FaPencilAlt, FaFileAlt, FaVideo } from "react-icons/fa";
import { api } from "@/utils/api";

interface ScriptSegment {
  visual: string;
  narration: string;
}

const CreatePage: React.FC = () => {
  const generateStory = api.generate.createStory.useMutation();

  const [step, setStep] = useState<number>(1);
  const [storyIdea, setStoryIdea] = useState<string>("");
  const [fullStory, setFullStory] = useState<string>("");
  const [generatedStory, setGeneratedStory] = useState<ScriptSegment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dummyThemes: string[] = [
    "Space Adventure",
    "Magical Forest",
    "Underwater World",
    "Dinosaur Discovery",
    "Fairy Tale Castle",
  ];

  const dummyScript: ScriptSegment[] = [
    {
      visual: "A vast night sky filled with twinkling stars.",
      narration:
        "Once upon a time, in a sky full of twinkling stars, there was a little star who dreamed of shining the brightest.",
    },
    {
      visual:
        "The little star trying to shine brighter but looking a bit dimmer compared to the other stars.",
      narration:
        "Every night, the little star tried its best, but it was always a little dimmer than the others.",
    },
    {
      visual: "The little star meeting a wise old moon.",
      narration:
        "One night, the little star met a wise old moon who shared a secret.",
    },
  ];

  const handleIdeaSubmit = async () => {
    setIsLoading(true);
    try {
      const text = await generateStory.mutateAsync({
        idea: storyIdea,
      });
      setFullStory(text);
      setIsLoading(false);
      setStep(2);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorySubmit = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      setGeneratedStory(dummyScript);
      setIsLoading(false);
      setStep(3);
    }, 2000); // Simulate 2 seconds of loading
  };

  const handleSegmentsEdit = (
    index: number,
    field: keyof ScriptSegment,
    value: string,
  ): void => {
    setGeneratedStory((story) =>
      story.map((segment, i) =>
        i === index ? { ...segment, [field]: value } : segment,
      ),
    );
  };

  const handleFinalize = (): void => {
    setStep(4);
  };

  return (
    <>
      <Head>
        <title>Create Story - Children's Story Maker AI</title>
        <meta
          name="description"
          content="Create your own AI-generated kids story"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-purple-100">
        <Navbar />
        <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 sm:py-12">
          <h1 className="mb-8 text-4xl font-extrabold text-indigo-700 drop-shadow-lg">
            Create Your Story
          </h1>
          <div className="mb-8 flex justify-center">
            <StepIndicator currentStep={step} />
          </div>
          {step === 1 && (
            <IdeaInput
              storyIdea={storyIdea}
              setStoryIdea={setStoryIdea}
              onSubmit={handleIdeaSubmit}
              themes={dummyThemes}
              isLoading={isLoading}
            />
          )}
          {step === 2 && (
            <StoryEditor
              story={fullStory}
              onEdit={setFullStory}
              onSubmit={handleStorySubmit}
              isLoading={isLoading}
            />
          )}
          {step === 3 && (
            <SegmentEditor
              story={generatedStory}
              onEdit={handleSegmentsEdit}
              onFinalize={handleFinalize}
            />
          )}
          {step === 4 && <VideoGeneration />}
        </main>
        <Footer />
      </div>
    </>
  );
};

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { icon: FaLightbulb, label: "Idea" },
    { icon: FaPencilAlt, label: "Story" },
    { icon: FaFileAlt, label: "Segments" },
    { icon: FaVideo, label: "Video" },
  ];

  return (
    <div className="flex space-x-10">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col items-center ${currentStep > index ? "text-green-500" : currentStep === index + 1 ? "text-blue-500" : "text-gray-400"}`}
        >
          <step.icon className="mb-2 text-2xl" />
          <span className="text-sm">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

interface IdeaInputProps {
  storyIdea: string;
  setStoryIdea: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  themes: string[];
  isLoading: boolean;
}

const IdeaInput: React.FC<IdeaInputProps> = ({
  storyIdea,
  setStoryIdea,
  onSubmit,
  themes,
  isLoading,
}) => {
  const maxCharacters = 200;

  const handleIdeaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newIdea = e.target.value.slice(0, maxCharacters);
      setStoryIdea(newIdea);
    },
    [setStoryIdea],
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-indigo-700">
        What's your story idea?
      </h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {themes.map((theme, index) => (
          <button
            key={index}
            className="rounded-full bg-indigo-100 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
            onClick={() => setStoryIdea(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
      <textarea
        className="mb-2 w-full rounded-md border border-gray-300 p-2"
        rows={4}
        value={storyIdea}
        onChange={handleIdeaChange}
        placeholder="Describe your story idea here..."
      />
      <div className="mb-4 text-right text-sm text-gray-500">
        {storyIdea.length}/{maxCharacters} characters
      </div>
      <button
        className="rounded-md bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-t-2 border-white"></div>
        ) : (
          "Generate Story"
        )}
      </button>
    </div>
  );
};

interface StoryEditorProps {
  story: string;
  onEdit: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const StoryEditor: React.FC<StoryEditorProps> = ({
  story,
  onEdit,
  onSubmit,
  isLoading,
}) => {
  const maxCharacters = 1000;

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newStory = e.target.value.slice(0, maxCharacters);
    onEdit(newStory);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-indigo-700">
        Edit Your Story
      </h2>
      <textarea
        className="mb-2 w-full rounded-md border border-gray-300 p-2"
        rows={10}
        value={story}
        onChange={handleStoryChange}
        placeholder="Your full story..."
      />
      <div className="mb-4 text-right text-sm text-gray-500">
        {story.length}/{maxCharacters} characters
      </div>
      <button
        className="rounded-md bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
        onClick={onSubmit}
        disabled={isLoading || story.length === 0}
      >
        {isLoading ? (
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-t-2 border-white"></div>
        ) : (
          "Generate Segments"
        )}
      </button>
    </div>
  );
};

interface SegmentEditorProps {
  story: ScriptSegment[];
  onEdit: (index: number, field: keyof ScriptSegment, value: string) => void;
  onFinalize: () => void;
}

const SegmentEditor: React.FC<SegmentEditorProps> = ({
  story,
  onEdit,
  onFinalize,
}) => {
  const maxCharactersNarration = 200;
  const maxCharactersVisual = 120;

  const handleInputChange = (
    index: number,
    field: keyof ScriptSegment,
    value: string,
  ) => {
    const maxChars =
      field === "visual" ? maxCharactersVisual : maxCharactersNarration;
    const newValue = value.slice(0, maxChars);
    onEdit(index, field, newValue);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-indigo-700">
        Edit Your Segments
      </h2>
      <div className="mb-6 rounded-md bg-blue-50 p-4 text-blue-800">
        <h3 className="mb-2 font-bold">What are segments?</h3>
        <p>
          Segments are short parts of your story that pair a visual description
          with narration. Each segment will become a scene in your final video.
          The visual description helps create the image, while the narration is
          the text that will be read aloud. Edit these to fine-tune your story!
        </p>
      </div>
      {story.map((segment, index) => (
        <div key={index} className="mb-6 rounded-md border border-gray-200 p-4">
          <h3 className="mb-2 font-bold">Segment {index + 1}</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Visual
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              value={segment.visual}
              onChange={(e) =>
                handleInputChange(index, "visual", e.target.value)
              }
            />
            <div className="mt-1 text-right text-sm text-gray-500">
              {segment.visual.length}/{maxCharactersVisual} characters
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Narration
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              rows={3}
              value={segment.narration}
              onChange={(e) =>
                handleInputChange(index, "narration", e.target.value)
              }
            />
            <div className="mt-1 text-right text-sm text-gray-500">
              {segment.narration.length}/{maxCharactersNarration} characters
            </div>
          </div>
        </div>
      ))}
      <button
        className="rounded-md bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
        onClick={onFinalize}
      >
        Generate Video
      </button>
    </div>
  );
};

const VideoGeneration: React.FC = () => {
  return (
    <div className="rounded-lg bg-white p-6 text-center shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-indigo-700">
        Generating Your Video
      </h2>
      <p className="mb-4">
        Please wait while we create your amazing story video!
      </p>
      <div className="mx-auto h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-indigo-500"></div>
    </div>
  );
};

export default CreatePage;
