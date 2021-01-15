const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require("@octokit/rest")

try {
  const token = core.getInput('token')
  const owner = core.getInput('owner')
  const repo = core.getInput('repo')
  const estimate_label_description = core.getInput('estimate-label-description')
  const pattern_column_name = core.getInput('pattern-column-name')
  const pattern_project_name = core.getInput('pattern-project-name')
  const project_state = core.getInput('project-state')

  const octokit = new Octokit({ auth: token, previews: ["inertia-preview"]})
  octokit.paginate("GET /repos/:owner/:repo/projects", { owner, repo }).then((projects) => (
    projects.filter((p) => matchToProjectStateAndPattern(p)).map((project) => {
      let projectJSON = JSON.stringify(project, undefined, 2)
      core.debug(projectJSON)
      octokit.paginate(project.columns_url).then((columns) => (
        columns.map((column) => {
          octokit.paginate(column.cards_url).then((cards) => (
            Promise.all(cards.map((card) => (
              octokit.issues.listLabelsOnIssue({owner,repo,issue_number: /[^/]*$/.exec(card.content_url)[0]}).then(({ data: labels }) => {
                let total = 0
                labels.filter((l) => l.description = estimate_label_description).map((l) => {
                  total = total + parseInt(l.name)
                })

                return total
              })
            ))).then((estimates) => {
              let name = ''
              const columnTotal = estimates.reduce((a, b) => a + b, 0)
              const numStringRegex = /\([0-9]+\)/gi

              if (column.name.search(numStringRegex) === -1) {
                name = `${column.name} (${columnTotal})`
              } else {
                name = column.name.replace(numStringRegex, `(${columnTotal})`)
              }

              octokit.projects.updateColumn({column_id: column.id,name})

              if (column.name.search(pattern_column_name) === 0) {
                octokit.request(`PATCH /projects/${project.id}`, {
                  body: `Done: ${columnTotal}`
                })
              }
            })
          ))
        })
      ))
    })
  ))

  function matchToProjectStateAndPattern(project) {
    return project.name.search(pattern_project_name) === 0 && project.state === project_state
  }
} catch (error) {
  core.setFailed(error.message)
}
