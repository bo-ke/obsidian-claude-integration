# Obsidian Claude Integration

A bidirectional integration plugin between Obsidian and Claude AI.

## Features

### 🔄 Bidirectional Integration

1. **Call Claude from Obsidian**
   - Chat with Claude directly within Obsidian
   - Analyze and improve note content with Claude
   - Enhance writing and thinking with AI

2. **Access Notes from Claude Desktop**
   - Run as an MCP Server
   - Claude Desktop can read, create, and modify notes
   - AI-driven note management

### ✨ Main Features

#### Obsidian Plugin Features

- **Chat with Claude**: Converse with Claude within Obsidian
- **Analyze Notes**: Let Claude analyze current note and provide insights
- **Improve Text**: Improve selected text using Claude
- **Streaming Response**: Real-time streaming responses from Claude
- **Flexible Configuration**: Configure model, temperature, max tokens, etc.

#### MCP Server Features

Provides the following tools for Claude Desktop:

- `list_notes`: List all notes or notes in a specific folder
- `read_note`: Read note content
- `write_note`: Create or overwrite a note
- `append_to_note`: Append content to the end of a note
- `search_notes`: Search notes containing specific text
- `delete_note`: Delete a note
- `create_folder`: Create a folder
- `get_note_metadata`: Get note metadata

## Installation

### Prerequisites

- Obsidian v0.15.0 or higher
- Node.js v18 or higher
- Anthropic API Key ([Get API Key](https://console.anthropic.com/))

### Installation Steps

1. **Clone or download this repository**
   ```bash
   cd /path/to/your/vault/.obsidian/plugins
   git clone https://github.com/yourusername/obsidian-claude-integration.git
   cd obsidian-claude-integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the plugin**
   ```bash
   npm run build
   ```

4. **Enable plugin in Obsidian**
   - Open Obsidian Settings
   - Go to "Community plugins"
   - Turn off "Safe mode"
   - Find "Claude Integration" in the installed plugins list
   - Enable the plugin

5. **Configure API Key**
   - Enter your Anthropic API Key in plugin settings
   - Configure other options (optional)

## Usage

### Using in Obsidian

#### Chat with Claude

1. Open command palette (`Ctrl/Cmd + P`)
2. Run command "Chat with Claude"
3. Chat with Claude in the popup dialog
4. Insert Claude's responses into your notes

#### Analyze Notes

1. Open the note you want to analyze
2. Run command "Analyze current note with Claude"
3. Claude will analyze the content and provide insights

#### Improve Text

1. Select the text you want to improve
2. Run command "Improve selected text with Claude"
3. Selected text will be replaced with Claude's improved version

### Using as MCP Server

#### 1. Compile MCP Server

```bash
npm run build
# Or create a standalone MCP server build
npx tsc mcp-server.ts --outDir dist --module nodenext
```

#### 2. Configure Claude Desktop

Edit Claude Desktop's configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "/path/to/your/vault/.obsidian/plugins/obsidian-claude-integration/dist/mcp-server.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/obsidian/vault"
      }
    }
  }
}
```

Replace paths with your actual paths:
- Path in `args` should point to the compiled `mcp-server.js`
- `OBSIDIAN_VAULT_PATH` should point to your Obsidian vault root directory

#### 3. Restart Claude Desktop

After restarting Claude Desktop, Claude can access and manipulate your notes.

#### 4. Use in Claude Desktop

Now you can say things like:

- "List all my notes"
- "Read the content of daily/2024-01-01.md"
- "Create a new project idea note in ideas/new-project.md"
- "Search all notes containing 'meeting'"
- "Help me summarize all daily notes from this week"

## Configuration Options

### Obsidian Plugin Settings

- **Claude API Key**: Your Anthropic API key
- **Model**: Claude model to use (Sonnet, Haiku, Opus)
- **Max Tokens**: Maximum tokens in response
- **Temperature**: Temperature for response generation (0-1)
- **Enable MCP Server**: Whether to enable MCP Server functionality
- **MCP Server Port**: MCP Server port (requires restart)

## Development

### Development Mode

```bash
npm run dev
```

This starts esbuild in watch mode, automatically recompiling code.

### Build Production Version

```bash
npm run build
```

### Project Structure

```
obsidian-claude-integration/
├── main.ts              # Obsidian plugin main file
├── mcp-server.ts        # MCP Server implementation
├── claude-client.ts     # Claude API client
├── note-tools.ts        # Note operation utilities
├── manifest.json        # Obsidian plugin manifest
├── package.json         # Node.js project config
├── tsconfig.json        # TypeScript config
├── esbuild.config.mjs   # esbuild config
└── README.md            # This file
```

## Security Notes

1. **API Key Security**: Never commit API Keys to version control
2. **Path Validation**: MCP Server validates all paths to prevent access outside vault
3. **Permission Control**: Consider using read-only mode for MCP Server (can be implemented via code modification)

## Troubleshooting

### Obsidian Plugin Won't Load

- Ensure you've run `npm install` and `npm run build`
- Check Obsidian console for errors (Ctrl/Cmd + Shift + I)
- Verify plugin folder is in the correct location

### Claude API Calls Failing

- Verify API Key is correct
- Check network connection
- Confirm API Key has sufficient credits

### MCP Server Connection Issues

- Confirm `OBSIDIAN_VAULT_PATH` environment variable is set correctly
- Check if `mcp-server.js` file exists and is compiled correctly
- Review Claude Desktop log files

### Claude Desktop Can't Find Tools

- Confirm Claude Desktop config file format is correct
- Restart Claude Desktop
- Check Node.js version meets requirements

## Roadmap

- [ ] Support more Claude models
- [ ] Add template functionality
- [ ] Implement automatic note summarization
- [ ] Support batch operations
- [ ] Add chat history saving
- [ ] Implement more MCP tools
- [ ] Support images and attachments
- [ ] Add keyboard shortcut configuration

## Contributing

Issues and Pull Requests are welcome!

## License

MIT License

## Related Links

- [Obsidian API Documentation](https://docs.obsidian.md/Home)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/download)

## Acknowledgments

- Obsidian team for the excellent note-taking app
- Anthropic for the powerful Claude AI
- Model Context Protocol for making AI integration easier
