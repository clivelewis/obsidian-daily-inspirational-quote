import { Plugin, TAbstractFile, TFile, TFolder, moment, Editor, MarkdownView } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
} from "obsidian-daily-notes-interface";
import { QuoteService } from "quote.service";

export default class InspirationalQuotePlugin extends Plugin {

	async onload() {
		console.log("Loading 'Daily Inspirational Quote' plugin...");

		// Artificial delay to give Obsidian time to load notes or else it will throw
		// 'create' events for already existing notes
		await new Promise((f) => setTimeout(f, 1500));

        const dailyNotesPluginEnabled: boolean = appHasDailyNotesPluginLoaded();

		if (!dailyNotesPluginEnabled) {
			console.log("Core daily notes plugin is disabled. Skipping 'create' event registration.");
		} else {
            this.registerEvent(
                this.app.vault.on("create", (file: TAbstractFile) => {
                    if (file instanceof TFile && this.isNewDailyNote(file)) {
                        this.getRandomBeautifiedQuote()
                            .then((quote) => file.vault.append(file, quote))
                            .catch((error) => console.log(`Error while fetching random quote: ${error}`));
                    }
                })
            );
        }
        
        
        this.addCommand({
            id: "inspirational-quote",
            name: "Insert inspirational quote",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.getRandomBeautifiedQuote()
                .then((quote) => editor.replaceSelection(quote));
            }
        });

        console.log("Loading finished!");
	}

	async onunload() {
        // Nothing to unload.
	}

	private isNewDailyNote(file: TAbstractFile): boolean {
		if (file instanceof TFolder) return false;

		var allDailyNotes: Record<string, TFile> = getAllDailyNotes();
		var keys = Object.keys(allDailyNotes);

		for (var key of keys) {
			if (allDailyNotes[key].path == file.path) {
				return true;
			}
		}

		return false;
	}

	private async getRandomBeautifiedQuote(): Promise<string> {
		var quote = await QuoteService.getRandomInspirationalQuote();
		return `> “${quote.content}” - ${quote.author}`;
	}
}
