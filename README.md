# Project estimates updater action

This repository provides a GitHub action to **automatically update GitHub projects description and each project columns titles with the total of estimate** for quick overview.

## Common usage
Each time you move a card, add or remove a label on issue this GitHub action automatically updates projects description and column titles with issue estimate totals, based on labels attached on issues.

## Requirements
Project must have one or more labels with a specific description (like Story Point that you specify in the inputs of the action) and a numeric value, such as 0.5 or 10.


## Inputs

- **token**  - GitHub repository token
- **owner** - GitHub user or organisation.
- **repo** - GitHub repository name.
- **pattern-project-name** - The pattern of the project name used to filter on projects in the repo. The project name must start with this pattern
- **project-state** - The Github project state
- **pattern-column-name** - The pattern of the column name used to calculate the estimate of a project. The column name must start with this pattern
- **estimate-label-description** - The description of the label used to store estimate informations

## Usage

```yml
name: Project estimates updater

on:
  issues:
    types: [labeled, unlabeled]
  project_card:
    types: [moved]

    jobs:
      update-project-estimates:
        runs-on: ubuntu-latest
        timeout-minutes: 1
        name: Update project estimates
        steps:
          - uses: ronan-lefeyer/project-estimates-action:1.0
            with:
              owner: ${{ github.repository_owner }}
              repo: ${{ github.event.repository.name }}
              token: ${{ secrets.GITHUB_TOKEN }}
              pattern-project-name: 'Sprint'
              project-state: 'open'
              column-name: 'Done'
              estimate-label-description: 'Story Point'
```
