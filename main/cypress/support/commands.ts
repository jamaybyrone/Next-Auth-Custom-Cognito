
// Print cypress-axe violations to the terminal
function printAccessibilityViolations(violations) {
  cy.task(
    'table',
    violations.map(({ id, impact, description, nodes }) => ({
      impact,
      description: `${description} (${id})`,
      nodes: nodes.length
    })),
  )
}

Cypress.Commands.add(
  'checkAccessibility',
  {
    prevSubject: 'optional'
  },
  (subject, { skipFailures = false } = {}) => {
    cy.checkA11y(subject, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a']
        //wcag211 wcag2a
      }
    }, printAccessibilityViolations, skipFailures)

  },
)
