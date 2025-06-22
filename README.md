<p align="center">
<img height="200" src="./assets/kv.png" alt="vscode-transfer">
</p>
<p align="center"> English | <a href="./README_zh.md">简体中文</a></p>

# VSCode Transfer - A Powerful Content Transformation Extension

**VSCode Transfer** is a lightweight and efficient Visual Studio Code extension designed to help developers quickly transform selected content into various formats. Whether you're working with JSON, strings, or naming conventions, this extension streamlines your workflow with a variety of powerful commands.

## Key Features

- **JSON Formatting**: Easily format objects into JSON.
- **Case Conversion**: Convert text to uppercase or lowercase.
- **Object and String Conversion**: Seamlessly switch between objects and strings.
- **String Manipulation**: Reverse strings with a single command.
- **Naming Conventions**: Transform text into camelCase, PascalCase, or kebab-case.
- **Path Conversion**: Convert absolute paths to relative paths based on current file location.
- **Quick Access Menu**: Access all transformations through a convenient VS Code menu.

## Available Commands

Here’s a list of all supported commands:

- **JSON Formatting**
  - `transfer.toJSON`: Converts an object to JSON format.
- **Case Conversion**
  - `transfer.uppercase`: Converts text to uppercase.
  - `transfer.lowercase`: Converts text to lowercase.
- **Object and String Conversion**
  - `transfer.objToStr`: Converts an object to a string.
  - `transfer.strToObj`: Converts a string to an object.
- **String Manipulation**
  - `transfer.reverse`: Reverses the selected string.
- **Naming Conventions**
  - `transfer.camel`: Converts text to camelCase.
  - `transfer.bigCamel`: Converts text to PascalCase (Big Camel Case).
  - `transfer.hyphen`: Converts text to kebab-case (hyphen-separated).
- **Path Conversion**
  - `transfer.toRelativePath`: Converts absolute paths to relative paths based on current file location.
- **Quick Access**
  - `transfer.transfer`: Opens the VS Code transfer menu for quick transformations.

## Why Choose VSCode Transfer?

- **Boost Productivity**: Save time by automating repetitive text transformations.
- **Developer-Friendly**: Intuitive commands and seamless integration with VS Code.
- **Customizable**: Quickly switch between transformation options via the VS Code interface.

### New Feature: Quick Switch via VS Code Options

The latest update introduces a **Quick Switch** feature, allowing users to toggle between transformation options directly from the VS Code interface. This enhancement simplifies the process of applying transformations without manually selecting commands.

## Installation

1. Open the Extensions view in VS Code (`Cmd+Shift+X` on macOS or `Ctrl+Shift+X` on Windows/Linux).
2. Search for `vscode-transfer`.
3. Click **Install** to add the extension to your editor.

## Usage

1. Select the text you want to transform in the editor.
2. Right-click and choose the desired transformation from the **vscode-transfer** submenu.
3. Alternatively, use the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) and type the command name.

## Contributing

Contributions are welcome! If you encounter any issues or have feature requests, please open an issue on [GitHub](https://github.com/Simon-He95/vscode-transfer/issues).

## :coffee: Support the Project

If you find this extension helpful, consider [buying me a coffee](https://github.com/Simon-He95/sponsor) to support its development.

## License

This project is licensed under the [MIT License](./license).
