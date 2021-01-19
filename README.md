# Project estimates updater action

This repository provides a GitHub action to **automatically update GitHub projects description and each project columns titles with the total of estimate** for quick overview.

## Common usage
Each time you move a card, add or remove a label on issue this GitHub action automatically updates projects description and column titles with issue estimate totals, based on labels attached on issues.

## Requirements
Project must have one or more labels with a specific description (like Story Point that you specify in the inputs of the action) and a numeric value, such as 0.5 or 10.


## Inputs

- **token** *(mandatory)* - GitHub repository token
- **pattern-project-name** *(mandatory)* - The pattern of the project name used to filter on projects in the repo. The project name must start with this pattern
- **project-state** *(default:open)* - The Github project state.
- **pattern-column-name** *(default:Done)*- The pattern of the column name used to calculate the estimate of a project. The column name must start with this pattern
- **estimate-label-description** *(default:Story Point)*- The description of the label used to store estimate informations

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
              token: ${{ secrets.GITHUB_TOKEN }}
              pattern-project-name: 'Sprint'
```
