# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) and update the config:

```js
// eslint.config.js
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config({
  // other rules...
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
})
```

## 🤖 AI Chat Integration

This project includes an AI-powered chat feature using OpenAI's API. To enable the AI assistant:

### 1. Create Environment Variables File

Create a `.env` file in the root of the `my-vue-app` directory with the following content:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get Your OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to the API keys section
4. Create a new API key
5. Copy the key and replace `your_openai_api_key_here` in your `.env` file

### 3. Features

- **AI Assistant Chat**: The "AI Assistant" (🤖) chat uses GPT-3.5-turbo to provide intelligent responses
- **Project Support**: The AI is configured to help with project updates, technical questions, and deployment issues
- **Real-time Responses**: See "AI is typing..." indicator while waiting for responses
- **Error Handling**: Graceful error messages if API calls fail

### 4. Usage

1. Click on the "AI Assistant" chat in the sidebar
2. Type any question about projects, development, deployments, etc.
3. The AI will respond with helpful, professional answers

### Example Questions to Ask the AI:
- "How do I deploy a React app to production?"
- "What are the best practices for state management?"
- "How can I optimize my application performance?"
- "What should I include in a project status update?"

---

**Note**: Make sure to keep your API key secure and never commit the `.env` file to version control!
