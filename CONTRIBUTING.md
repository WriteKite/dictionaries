# Contributing to the WriteKite dictionaries

The 28 dictionaries each have a folder, `dictionaries/<id>/`, with ids such as `general`, `legal`, `medical` and
`maritime`. Search existing issues first.

## Adding a missing word

Open the "Add words" form. After a spelling that's wrong in any of the regions `US GB CA AU IN`, name those where it's
right.

For a pull request:

1. Add your word or term to `dictionaries/<id>/words.txt`, one entry per line.

   ```
   profit à prendre
   res judicata
   ```

2. If a spelling is right in only some regions, add it to the folder's `regional.csv` instead, with those regions in the
   order above. Words there have no space or hyphen.

   ```
   metacenter,US
   metacentre,GB CA AU IN
   ```

3. Keep both files sorted ignoring capitals, then by exact spelling.
4. Run the check, adding your list's id (Node.js 20 or later). It prints the file, line and problem.

   ```
   node scripts/check.mjs legal
   ```

5. Open a pull request for that one list. Its checklist also covers evidence, a passing check and agreement to the
   license sentence below.

Use capitals only for a word that's always capitalized, like `Lipitor`. An entry with capitals matches only those
capitals, and a lowercase one matches any. Keep accents where English keeps them. Never edit the top-level `words.txt`
and `regional.csv`. They combine every dictionary. Each release makes them again.

## Fixing or removing a wrong entry

Open the "Report a wrong word" form. For a pull request, edit or delete the line, follow steps 3 to 5 and say what was
wrong. These reports come before additions, because a wrong entry stops that list's users from seeing a real
misspelling.

## Requesting a new dictionary

Use the "Suggest a dictionary" form. Pull requests are only for existing lists.

## What a suggestion needs

- The word isn't already in that dictionary.
- It belongs to that dictionary's field and isn't an everyday word.
- Every word you add needs evidence. Link its entry in a dictionary or an authority's list. Examples are drug lists,
  taxonomies and the word lists in standards. Or link two published uses by different people. Nothing an AI wrote
  counts.
- No misspellings, and no variants mostly seen as mistakes.
- Don't join words where dictionaries keep a hyphen or space.
- A foreign word counts only if the field's English writing uses it.

By contributing, you agree that your contribution is licensed under the license of the list it changes, as `LICENSE.md`
sets out, and that Nametab, LLC may publish it under that license.

Accepted changes ship in the next release. Not every suggestion gets in.
