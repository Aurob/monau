"""
===============================================================================
Book Catalog Updater
===============================================================================
NAME
    book_catalog_updater - Interactive command-line interface for managing a book catalog

SYNOPSIS
    python book_catalog_updater.py

DESCRIPTION
    The Book Catalog Updater is a Python script that provides an interactive
    command-line interface for managing a book catalog. It allows users to search
    for books using the OpenLibrary API, view search results, and add selected
    books to a JSON-formatted catalog file.

    The script uses the cmd module for the interactive interface and the rich
    library for colorful and formatted output.

COMMANDS
    search <query>
        Search for books using the provided query string. Displays up to 10 results.

    add <number>
        Add a book from the search results to the catalog. The <number> corresponds
        to the result number displayed in the search results.

    help [command]
        Display help about available commands or detailed help for a specific command.

    quit
        Exit the program.

FILES
    books.json
        The JSON file where the book catalog is stored. Created if it doesn't exist.

ENVIRONMENT
    No special environment variables are used.

DEPENDENCIES
    - Python 3.6+
    - requests library
    - rich library

EXAMPLES
    To search for books:
        (book catalog) search The Great Gatsby

    To add a book from the search results:
        (book catalog) add 1

NOTES
    - The catalog is sorted by author's last name and then by the first letter of
      the last name.
    - Book cover URLs are included in the catalog when available.

AUTHOR
    Created by Claude (Anthropic AI)

VERSION
    1.1 (July 21, 2024)

REPORTING BUGS
    For the latest updates or to report issues, please contact the human maintainer
    of this script.

"""

import json
import requests
import cmd
from typing import Dict, List, Any
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text

console = Console()

class BookCatalog(cmd.Cmd):
    prompt = Text('(book catalog) ', style="bold magenta")
    intro = Panel(Text("Welcome to the Book Catalog Updater. Type 'help' for commands.", style="italic green"), 
                  title="Book Catalog Updater", border_style="blue")

    def __init__(self):
        super().__init__()
        self.current_results = []

    def do_search(self, arg):
        """Search for a book: search <query>"""
        if not arg:
            console.print("[bold red]Please provide a search query.[/bold red]")
            return
        with console.status("[bold green]Searching for books...[/bold green]"):
            self.current_results = self.query_openlibrary(arg)
        if not self.current_results:
            console.print("[bold red]No results found. Please try another search.[/bold red]")
        else:
            self.display_results()

    def do_add(self, arg):
        """Add a book from the search results to the catalog: add <number>"""
        if not self.current_results:
            console.print("[bold red]No search results. Please perform a search first.[/bold red]")
            return
        try:
            index = int(arg) - 1
            if 0 <= index < len(self.current_results):
                self.update_json_file(self.current_results[index])
                console.print(f"[bold green]Added '{self.current_results[index]['title']}' to the catalog.[/bold green]")
            else:
                console.print("[bold red]Invalid number. Please choose a number from the search results.[/bold red]")
        except ValueError:
            console.print("[bold red]Please enter a valid number.[/bold red]")

    def do_quit(self, arg):
        """Exit the program"""
        console.print(Panel(Text("Thank you for using the Book Catalog Updater. Goodbye!", style="italic green"), 
                            border_style="blue"))
        return True

    def do_help(self, arg):
        """List available commands with "help" or detailed help with "help cmd"."""
        super().do_help(arg)

    def query_openlibrary(self, query: str) -> List[Dict[str, Any]]:
        url = f"https://openlibrary.org/search.json?q={query}&lang=en"
        response = requests.get(url)
        data = response.json()
        return data['docs'][:10]

    def display_results(self) -> None:
        table = Table(title="Search Results")
        table.add_column("No.", style="cyan", no_wrap=True)
        table.add_column("Title", style="magenta")
        table.add_column("Author(s)", style="green")
        table.add_column("URL", style="blue")

        for i, book in enumerate(self.current_results, 1):
            title = book.get('title', 'Unknown Title')
            authors = ', '.join(book.get('author_name', ['Unknown Author']))
            url = f"https://openlibrary.org{book.get('key', '')}"
            table.add_row(str(i), title, authors, url)

        console.print(table)

    def get_cover_url(self, cover_id: str) -> str:
        return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"

    def get_last_name(self, author: str) -> str:
        return author.split()[-1]

    def update_json_file(self, book: Dict[str, Any], filename: str = 'books.json') -> None:
        try:
            with open(filename, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {}

        author = book['author_name'][0]
        last_name = self.get_last_name(author)
        first_letter = last_name[0].upper()

        if first_letter not in data:
            data[first_letter] = {}
        if author not in data[first_letter]:
            data[first_letter][author] = []

        new_book = {
            "title": book['title'],
            "book_url": f"https://openlibrary.org{book['key']}",
            "cover_url": self.get_cover_url(book['cover_i']) if 'cover_i' in book else ""
        }

        data[first_letter][author].append(new_book)

        # Sort the authors within each letter
        data[first_letter] = dict(sorted(data[first_letter].items(), key=lambda x: self.get_last_name(x[0])))

        # Sort the letters
        data = dict(sorted(data.items()))

        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

if __name__ == "__main__":
    BookCatalog().cmdloop()