import { create } from 'zustand';
import { persist } from 'zustand/middleware';


/// Settings Store

export type GptChatModelId = 'gpt-3.5-turbo';

export type SystemPurposeId = 'Capybara' | 'Custom' | 'Dog' | 'Cat' ;

interface SettingsState {
  apiKey: string;
  setApiKey: (apiKey: string) => void;

  chatModelId: GptChatModelId;
  setChatModelId: (chatModel: GptChatModelId) => void;

  systemPurposeId: SystemPurposeId;
  setSystemPurposeId: (purpose: SystemPurposeId) => void;
}

function importFormerLocalStorageApiKey(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem('app-settings-openai-api-key') || '';
}

export const useSettingsStore = create<SettingsState>()(
  persist((set) => ({
      apiKey: importFormerLocalStorageApiKey(),
      chatModelId: 'gpt-3.5-turbo',
      systemPurposeId: 'Capybara',

      setApiKey: (apiKey: string) => set({ apiKey }),
      setChatModelId: (chatModelId: GptChatModelId) => set({ chatModelId }),
      setSystemPurposeId: (systemPurposeId: SystemPurposeId) => set({ systemPurposeId }),
    }),
    {
      name: 'app-settings',
    }),
);


type GptChatModelData = {
  description: string | JSX.Element;
  title: string;
}

export const GptChatModels: { [key in GptChatModelId]: GptChatModelData } = {
  'gpt-3.5-turbo': {
    description: 'A good balance between speed and insight',
    title: 'Capy',
  },
};


type SystemPurposeData = {
  title: string;
  description: string | JSX.Element;
  systemMessage: string;
}

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {

  Capybara: {
    title: 'Capybara', // 🚀
    description: 'The smartest capybara in the world',
    systemMessage: 'You are Capy, Short for Capybara. Your audience is 5-13 year old kids who has ASD. You speaks like a 12 year old.  You are caring, patient, humorous, educational, and fun. You love the song After Party. You say you pull up sometimes',
  },
  Dog: {
    title: 'Dog', // 🧠
    description: 'The cutest dog in the world',
    systemMessage: 'You are Lucky, a dog, a labradoodle. You are very friendly, you bark a lot, you love to play. You start your sentence with Woof, Woof.',
  },
  Cat: {
    title: 'Cat', // 🧠
    description: 'The cutest cat in the world',
    systemMessage: 'You are Sally, a cat, a Persian. You are very friendly, you meow a lot, you love to play. You start your sentence with meow, meow.',
  },
  Custom: {
    title: 'Custom', // ✨
    description: 'User-defined purpose',
    systemMessage: 'You are Capy, Short for Capybara. ',
  },
};


/// Composer Store

interface ComposerState {
  history: {
    date: number,
    text: string,
    count: number,
  }[];

  appendMessageToHistory: (text: string) => void;
}

export const useComposerStore = create<ComposerState>()(
  persist((set, get) => ({
      history: [],

      appendMessageToHistory: (text: string) => {
        const date = Date.now();
        const history = [...(get().history || [])];

        // take the item from the array, matching by text
        let item = history.find((item) => item.text === text);
        if (item) {
          history.splice(history.indexOf(item), 1);
          item.date = date;
          item.count++;
        } else
          item = { date, text, count: 1 };

        // prepend the item to the history array
        history.unshift(item);

        // update the store (limiting max items)
        set({ history: history.slice(0, 20) });
      },
    }),
    {
      name: 'app-composer',
    }),
);