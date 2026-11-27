# WriteKite dictionaries

Spelling dictionaries from [WriteKite](https://writekite.io): 28 plain-text word lists, one general and the rest by
subject (legal, medical, maritime, music and more). If a spell checker or tool takes word lists, it can use them. All
are free for any use, commercial included, but the terms differ by list. See [License](#license).

## Use

In WriteKite, writers on a paid plan add them in Settings, Dictionaries.

Anywhere else, use the `words.txt` files. Each has one entry per line and nothing else. They have no regional spellings.
Pick yours out of `regional.csv` by region code.

Two files, rebuilt after every change, combine everything:

- [`words.txt`](https://writekite.github.io/dictionaries/words.txt): the entries of every dictionary
- [`regional.csv`](https://writekite.github.io/dictionaries/regional.csv): every regional spelling

## Dictionaries

| Dictionary | Covers | Entries | License |
| --- | --- | ---: | --- |
| [All dictionaries](https://writekite.github.io/dictionaries/words.txt) | Every list below in one file, with regional spellings in [regional.csv](https://writekite.github.io/dictionaries/regional.csv) | 332,350 | CC BY-SA 4.0 |
| [Agriculture](dictionaries/agriculture/) | Agriculture, food, forestry, fisheries, and environmental sciences. | 53,185 | WriteKite Dictionary License |
| [Architecture and construction](dictionaries/architecture-and-construction/) | Buildings, architectural elements, construction, and building materials. | 2,033 | WriteKite Dictionary License |
| [Art and design](dictionaries/art-and-design/) | Art styles and periods, visual works, techniques, and typography. | 4,775 | WriteKite Dictionary License |
| [Astronomy](dictionaries/astronomy/) | Astrophysics, stars, planets, and observational astronomy. | 4,071 | CC BY-SA 3.0 |
| [Aviation](dictionaries/aviation/) | Aviation, aircraft, and aeronautics. | 125 | CC BY-SA 4.0 |
| [Biology](dictionaries/biology/) | Cell biology, molecular functions, and biological processes. | 84,922 | WriteKite Dictionary License |
| [Chemistry](dictionaries/chemistry/) | Chemical compounds, metabolites, and biochemical terminology. | 34,049 | WriteKite Dictionary License |
| [Cooking and food](dictionaries/cooking-and-food/) | Cooking, baking, dishes, ingredients, and kitchenware. | 1,401 | CC BY-SA 4.0 |
| [Earth sciences](dictionaries/earth-sciences/) | Minerals, rocks, and geological time. | 6,485 | CC BY-SA 4.0 |
| [Economics and business](dictionaries/economics-and-business/) | Economics, business, management, and marketing. | 302 | WriteKite Dictionary License |
| [Fashion and textiles](dictionaries/fashion-and-textiles/) | Clothing, costume history, fabrics, and textile techniques. | 1,416 | CC BY-SA 4.0 |
| [Finance and accounting](dictionaries/finance-and-accounting/) | Finance, accounting, banking, insurance, and tax. | 393 | CC BY-SA 4.0 |
| [Fitness](dictionaries/fitness/) | Exercise, weight training, bodybuilding, and yoga. | 78 | CC BY-SA 4.0 |
| [Gaming](dictionaries/gaming/) | Video games, tabletop and role-playing games, cards, and chess. | 303 | CC BY-SA 4.0 |
| [General English](dictionaries/general/) | Words a general dictionary misses, mostly scientific, medical and financial. | 10,302 | WriteKite Dictionary License |
| [History and archaeology](dictionaries/history-and-archaeology/) | Ancient places, peoples, and the names of historical periods. | 3,627 | WriteKite Dictionary License |
| [Legal](dictionaries/legal/) | Law, courts, contracts, and legal Latin. | 1,158 | CC BY-SA 4.0 |
| [Linguistics](dictionaries/linguistics/) | Linguistics, grammar, phonetics, and the names of languages. | 6,824 | CC BY-SA 4.0 |
| [Maritime](dictionaries/maritime/) | Ships, sailing, seamanship, and marine navigation. | 519 | CC BY-SA 4.0 |
| [Mathematics and statistics](dictionaries/mathematics-and-statistics/) | Mathematics, statistics, and named theorems and methods. | 5,822 | CC BY-SA 4.0 |
| [Medical](dictionaries/medical/) | Medicine, anatomy, and health sciences. | 109,011 | WriteKite Dictionary License |
| [Military and government](dictionaries/military-and-government/) | Armed forces, weapons, government, and politics. | 877 | CC BY-SA 4.0 |
| [Music](dictionaries/music/) | Musical instruments, genres, and music theory. | 2,188 | CC BY-SA 4.0 |
| [Pharmacy and drug names](dictionaries/pharmacy-and-drug-names/) | Generic drug names, salt forms, and US brand names. | 6,396 | WriteKite Dictionary License |
| [Physics](dictionaries/physics/) | Physics, from quantum and particle physics to optics and materials. | 3,512 | CC BY-SA 4.0 |
| [Religion](dictionaries/religion/) | Religion, theology, scripture, and Bible names. | 2,864 | CC BY-SA 4.0 |
| [Sports](dictionaries/sports/) | Sports, their rules, positions, and terms. | 748 | CC BY-SA 4.0 |
| [Technology](dictionaries/technology/) | Software, networking, and cybersecurity. | 2,189 | WriteKite Dictionary License |

## Format

Each dictionary has a folder, `dictionaries/<id>/`, with these files:

- `words.txt`: entries right in all five regions (`US`, `GB`, `CA`, `AU`, `IN`)
- `regional.csv`: regional spellings, in lists that have them
- `dictionary.json`: name, description, version, license and sources
- `LICENSE.txt`: in some folders

An entry is a word or a term of up to 12 words. A lowercase entry matches any capitalization. An entry with capitals
matches those capitals only.

`regional.csv` lists each spelling with its regions:

```csv
entry,regions
…
metacenter,US
metacentre,GB CA AU IN
…
```

## Releases

Each release on GitHub has one `.wkdict` file per dictionary, one `index-<region>.wkidx.gz` per spelling region
(`en-US`, `en-GB`, `en-CA`, `en-AU`, `en-IN`) saying which dictionaries hold a word, `catalog.json` and `LICENSE.md`.
The `.wkdict` and `.wkidx` files are WriteKite's compiled formats. The catalog lists every dictionary's name, version,
license, file size, SHA-256, counts and sources, and each index's size and SHA-256. Downloads are free.

## Contributing

Open an issue with one of these forms:

- Add words
- Report a wrong word
- Suggest a dictionary

[`CONTRIBUTING.md`](CONTRIBUTING.md) says how to contribute.

The format check needs Node.js 20 or later:

```sh
node scripts/check.mjs
```

## License

**The lists don't all have the same license.**

- WriteKite Dictionary License: 11 lists. You must give credit. Use the words "Dictionaries by WriteKite
  (writekite.io)", linked to https://writekite.io.
- CC BY-SA: lists with a share-alike source. Wiktionary is a source of this kind. The IMA mineral list is another. The
  Unified Astronomy Thesaurus is one too. These lists ask for the same credit.
- CC BY-SA 4.0: the combined `words.txt` and `regional.csv`.

Each list's `dictionary.json` names its license. The full terms are in [`LICENSE.md`](LICENSE.md).
