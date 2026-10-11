/**
 * Knowledge Graph Engine for AgPlacify
 * Domain-independent, prerequisite-aware skill graph structure supporting arbitrary domains.
 * Hierarchy: Domain -> Topics -> Subtopics -> Skills/Concepts -> Subskills -> (Prerequisites, Difficulty, Learning Dependencies)
 * Expanded to 36 skills per domain (12 Beginner, 12 Intermediate, 12 Advanced) for 100% 6-month roadmap completeness.
 */

const DOMAIN_KNOWLEDGE_GRAPHS = {
  "fullstack": {
    "domainId": "fullstack",
    "domainName": "Full-Stack Web Development",
    "topics": [
      {
        "id": "fullstack_top_beginner",
        "name": "Full-Stack Web Development — Beginner Tier",
        "subtopics": [
          {
            "id": "fullstack_sub_beginner_1",
            "name": "HTML5 Semantic Elements & Core Concepts",
            "skills": [
              {
                "skillId": "web_html_elem",
                "skillName": "HTML5 Semantic Elements",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_html_elem_sub1",
                    "subskillName": "HTML5 Semantic Elements: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_elem_sub2",
                    "subskillName": "HTML5 Semantic Elements: Component Structure & Memory",
                    "prerequisites": [
                      "web_html_elem_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_elem_sub3",
                    "subskillName": "HTML5 Semantic Elements: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_html_elem_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_elem_sub4",
                    "subskillName": "HTML5 Semantic Elements: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_html_elem_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_elem_sub5",
                    "subskillName": "HTML5 Semantic Elements: Integration & Placement Questions",
                    "prerequisites": [
                      "web_html_elem_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_elem_sub6",
                    "subskillName": "HTML5 Semantic Elements: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_html_elem_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_css_box",
                "skillName": "CSS Box Model & Flexbox",
                "prerequisites": [
                  "web_html_elem"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_css_box_sub1",
                    "subskillName": "CSS Box Model & Flexbox: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_box_sub2",
                    "subskillName": "CSS Box Model & Flexbox: Component Structure & Memory",
                    "prerequisites": [
                      "web_css_box_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_box_sub3",
                    "subskillName": "CSS Box Model & Flexbox: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_css_box_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_box_sub4",
                    "subskillName": "CSS Box Model & Flexbox: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_css_box_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_box_sub5",
                    "subskillName": "CSS Box Model & Flexbox: Integration & Placement Questions",
                    "prerequisites": [
                      "web_css_box_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_box_sub6",
                    "subskillName": "CSS Box Model & Flexbox: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_css_box_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_css_grid",
                "skillName": "CSS Grid & Responsive Layouts",
                "prerequisites": [
                  "web_css_box"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_css_grid_sub1",
                    "subskillName": "CSS Grid & Responsive Layouts: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_grid_sub2",
                    "subskillName": "CSS Grid & Responsive Layouts: Component Structure & Memory",
                    "prerequisites": [
                      "web_css_grid_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_grid_sub3",
                    "subskillName": "CSS Grid & Responsive Layouts: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_css_grid_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_grid_sub4",
                    "subskillName": "CSS Grid & Responsive Layouts: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_css_grid_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_grid_sub5",
                    "subskillName": "CSS Grid & Responsive Layouts: Integration & Placement Questions",
                    "prerequisites": [
                      "web_css_grid_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_grid_sub6",
                    "subskillName": "CSS Grid & Responsive Layouts: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_css_grid_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "js_vars_types",
                "skillName": "JS Variables, Types & Operators",
                "prerequisites": [
                  "web_css_box"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "js_vars_types_sub1",
                    "subskillName": "JS Variables, Types & Operators: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_vars_types_sub2",
                    "subskillName": "JS Variables, Types & Operators: Component Structure & Memory",
                    "prerequisites": [
                      "js_vars_types_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_vars_types_sub3",
                    "subskillName": "JS Variables, Types & Operators: Implementation Patterns & Flow",
                    "prerequisites": [
                      "js_vars_types_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_vars_types_sub4",
                    "subskillName": "JS Variables, Types & Operators: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "js_vars_types_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_vars_types_sub5",
                    "subskillName": "JS Variables, Types & Operators: Integration & Placement Questions",
                    "prerequisites": [
                      "js_vars_types_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_vars_types_sub6",
                    "subskillName": "JS Variables, Types & Operators: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "js_vars_types_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "fullstack_sub_beginner_2",
            "name": "Control Flow, Loops & Core Concepts",
            "skills": [
              {
                "skillId": "js_control_flow",
                "skillName": "Control Flow, Loops & Conditionals",
                "prerequisites": [
                  "js_vars_types"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "js_control_flow_sub1",
                    "subskillName": "Control Flow, Loops & Conditionals: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_control_flow_sub2",
                    "subskillName": "Control Flow, Loops & Conditionals: Component Structure & Memory",
                    "prerequisites": [
                      "js_control_flow_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_control_flow_sub3",
                    "subskillName": "Control Flow, Loops & Conditionals: Implementation Patterns & Flow",
                    "prerequisites": [
                      "js_control_flow_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_control_flow_sub4",
                    "subskillName": "Control Flow, Loops & Conditionals: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "js_control_flow_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_control_flow_sub5",
                    "subskillName": "Control Flow, Loops & Conditionals: Integration & Placement Questions",
                    "prerequisites": [
                      "js_control_flow_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_control_flow_sub6",
                    "subskillName": "Control Flow, Loops & Conditionals: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "js_control_flow_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "js_funcs_scope",
                "skillName": "JS Functions, Scope & Closures",
                "prerequisites": [
                  "js_control_flow"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "js_funcs_scope_sub1",
                    "subskillName": "JS Functions, Scope & Closures: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_funcs_scope_sub2",
                    "subskillName": "JS Functions, Scope & Closures: Component Structure & Memory",
                    "prerequisites": [
                      "js_funcs_scope_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_funcs_scope_sub3",
                    "subskillName": "JS Functions, Scope & Closures: Implementation Patterns & Flow",
                    "prerequisites": [
                      "js_funcs_scope_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_funcs_scope_sub4",
                    "subskillName": "JS Functions, Scope & Closures: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "js_funcs_scope_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_funcs_scope_sub5",
                    "subskillName": "JS Functions, Scope & Closures: Integration & Placement Questions",
                    "prerequisites": [
                      "js_funcs_scope_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_funcs_scope_sub6",
                    "subskillName": "JS Functions, Scope & Closures: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "js_funcs_scope_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "js_arrays_objs",
                "skillName": "JS Arrays, Objects & ES6+ Features",
                "prerequisites": [
                  "js_funcs_scope"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "js_arrays_objs_sub1",
                    "subskillName": "JS Arrays, Objects & ES6+ Features: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_arrays_objs_sub2",
                    "subskillName": "JS Arrays, Objects & ES6+ Features: Component Structure & Memory",
                    "prerequisites": [
                      "js_arrays_objs_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_arrays_objs_sub3",
                    "subskillName": "JS Arrays, Objects & ES6+ Features: Implementation Patterns & Flow",
                    "prerequisites": [
                      "js_arrays_objs_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_arrays_objs_sub4",
                    "subskillName": "JS Arrays, Objects & ES6+ Features: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "js_arrays_objs_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_arrays_objs_sub5",
                    "subskillName": "JS Arrays, Objects & ES6+ Features: Integration & Placement Questions",
                    "prerequisites": [
                      "js_arrays_objs_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_arrays_objs_sub6",
                    "subskillName": "JS Arrays, Objects & ES6+ Features: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "js_arrays_objs_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_git_basics",
                "skillName": "Git Version Control & Repository Setup",
                "prerequisites": [
                  "web_html_elem"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_git_basics_sub1",
                    "subskillName": "Git Version Control & Repository Setup: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_git_basics_sub2",
                    "subskillName": "Git Version Control & Repository Setup: Component Structure & Memory",
                    "prerequisites": [
                      "web_git_basics_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_git_basics_sub3",
                    "subskillName": "Git Version Control & Repository Setup: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_git_basics_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_git_basics_sub4",
                    "subskillName": "Git Version Control & Repository Setup: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_git_basics_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_git_basics_sub5",
                    "subskillName": "Git Version Control & Repository Setup: Integration & Placement Questions",
                    "prerequisites": [
                      "web_git_basics_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_git_basics_sub6",
                    "subskillName": "Git Version Control & Repository Setup: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_git_basics_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "fullstack_sub_beginner_3",
            "name": "HTML5 Form Validation & Core Concepts",
            "skills": [
              {
                "skillId": "web_html_forms_a11y",
                "skillName": "HTML5 Form Validation & ARIA Accessibility",
                "prerequisites": [
                  "web_html_elem"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_html_forms_a11y_sub1",
                    "subskillName": "HTML5 Form Validation & ARIA Accessibility: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_forms_a11y_sub2",
                    "subskillName": "HTML5 Form Validation & ARIA Accessibility: Component Structure & Memory",
                    "prerequisites": [
                      "web_html_forms_a11y_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_forms_a11y_sub3",
                    "subskillName": "HTML5 Form Validation & ARIA Accessibility: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_html_forms_a11y_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_forms_a11y_sub4",
                    "subskillName": "HTML5 Form Validation & ARIA Accessibility: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_html_forms_a11y_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_forms_a11y_sub5",
                    "subskillName": "HTML5 Form Validation & ARIA Accessibility: Integration & Placement Questions",
                    "prerequisites": [
                      "web_html_forms_a11y_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_html_forms_a11y_sub6",
                    "subskillName": "HTML5 Form Validation & ARIA Accessibility: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_html_forms_a11y_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_css_animations",
                "skillName": "CSS Transitions, Transforms & Keyframes",
                "prerequisites": [
                  "web_css_grid"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_css_animations_sub1",
                    "subskillName": "CSS Transitions, Transforms & Keyframes: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_animations_sub2",
                    "subskillName": "CSS Transitions, Transforms & Keyframes: Component Structure & Memory",
                    "prerequisites": [
                      "web_css_animations_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_animations_sub3",
                    "subskillName": "CSS Transitions, Transforms & Keyframes: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_css_animations_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_animations_sub4",
                    "subskillName": "CSS Transitions, Transforms & Keyframes: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_css_animations_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_animations_sub5",
                    "subskillName": "CSS Transitions, Transforms & Keyframes: Integration & Placement Questions",
                    "prerequisites": [
                      "web_css_animations_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_css_animations_sub6",
                    "subskillName": "CSS Transitions, Transforms & Keyframes: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_css_animations_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_npm_tooling",
                "skillName": "Node Package Manager (NPM) & Modern Bundlers",
                "prerequisites": [
                  "js_vars_types"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_npm_tooling_sub1",
                    "subskillName": "Node Package Manager (NPM) & Modern Bundlers: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_npm_tooling_sub2",
                    "subskillName": "Node Package Manager (NPM) & Modern Bundlers: Component Structure & Memory",
                    "prerequisites": [
                      "web_npm_tooling_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_npm_tooling_sub3",
                    "subskillName": "Node Package Manager (NPM) & Modern Bundlers: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_npm_tooling_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_npm_tooling_sub4",
                    "subskillName": "Node Package Manager (NPM) & Modern Bundlers: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_npm_tooling_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_npm_tooling_sub5",
                    "subskillName": "Node Package Manager (NPM) & Modern Bundlers: Integration & Placement Questions",
                    "prerequisites": [
                      "web_npm_tooling_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_npm_tooling_sub6",
                    "subskillName": "Node Package Manager (NPM) & Modern Bundlers: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_npm_tooling_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_browser_storage",
                "skillName": "Client-Side Storage: LocalStorage & SessionStorage",
                "prerequisites": [
                  "js_arrays_objs"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "web_browser_storage_sub1",
                    "subskillName": "Client-Side Storage: LocalStorage & SessionStorage: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_browser_storage_sub2",
                    "subskillName": "Client-Side Storage: LocalStorage & SessionStorage: Component Structure & Memory",
                    "prerequisites": [
                      "web_browser_storage_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_browser_storage_sub3",
                    "subskillName": "Client-Side Storage: LocalStorage & SessionStorage: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_browser_storage_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_browser_storage_sub4",
                    "subskillName": "Client-Side Storage: LocalStorage & SessionStorage: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_browser_storage_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_browser_storage_sub5",
                    "subskillName": "Client-Side Storage: LocalStorage & SessionStorage: Integration & Placement Questions",
                    "prerequisites": [
                      "web_browser_storage_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_browser_storage_sub6",
                    "subskillName": "Client-Side Storage: LocalStorage & SessionStorage: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_browser_storage_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fullstack_top_intermediate",
        "name": "Full-Stack Web Development — Intermediate Tier",
        "subtopics": [
          {
            "id": "fullstack_sub_intermediate_1",
            "name": "DOM Selection & Core Concepts",
            "skills": [
              {
                "skillId": "js_dom_events",
                "skillName": "DOM Selection & Event Handling",
                "prerequisites": [
                  "js_arrays_objs"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "js_dom_events_sub1",
                    "subskillName": "DOM Selection & Event Handling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_dom_events_sub2",
                    "subskillName": "DOM Selection & Event Handling: Component Structure & Memory",
                    "prerequisites": [
                      "js_dom_events_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_dom_events_sub3",
                    "subskillName": "DOM Selection & Event Handling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "js_dom_events_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_dom_events_sub4",
                    "subskillName": "DOM Selection & Event Handling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "js_dom_events_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_dom_events_sub5",
                    "subskillName": "DOM Selection & Event Handling: Integration & Placement Questions",
                    "prerequisites": [
                      "js_dom_events_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_dom_events_sub6",
                    "subskillName": "DOM Selection & Event Handling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "js_dom_events_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "js_promises_async",
                "skillName": "Promises & Async/Await",
                "prerequisites": [
                  "js_dom_events"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "js_promises_async_sub1",
                    "subskillName": "Promises & Async/Await: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_promises_async_sub2",
                    "subskillName": "Promises & Async/Await: Component Structure & Memory",
                    "prerequisites": [
                      "js_promises_async_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_promises_async_sub3",
                    "subskillName": "Promises & Async/Await: Implementation Patterns & Flow",
                    "prerequisites": [
                      "js_promises_async_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_promises_async_sub4",
                    "subskillName": "Promises & Async/Await: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "js_promises_async_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_promises_async_sub5",
                    "subskillName": "Promises & Async/Await: Integration & Placement Questions",
                    "prerequisites": [
                      "js_promises_async_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_promises_async_sub6",
                    "subskillName": "Promises & Async/Await: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "js_promises_async_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "js_fetch_api",
                "skillName": "Fetch API & AJAX Integration",
                "prerequisites": [
                  "js_promises_async"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "js_fetch_api_sub1",
                    "subskillName": "Fetch API & AJAX Integration: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_fetch_api_sub2",
                    "subskillName": "Fetch API & AJAX Integration: Component Structure & Memory",
                    "prerequisites": [
                      "js_fetch_api_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_fetch_api_sub3",
                    "subskillName": "Fetch API & AJAX Integration: Implementation Patterns & Flow",
                    "prerequisites": [
                      "js_fetch_api_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_fetch_api_sub4",
                    "subskillName": "Fetch API & AJAX Integration: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "js_fetch_api_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_fetch_api_sub5",
                    "subskillName": "Fetch API & AJAX Integration: Integration & Placement Questions",
                    "prerequisites": [
                      "js_fetch_api_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "js_fetch_api_sub6",
                    "subskillName": "Fetch API & AJAX Integration: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "js_fetch_api_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "react_jsx_comps",
                "skillName": "React JSX & Component Hierarchy",
                "prerequisites": [
                  "js_fetch_api"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "react_jsx_comps_sub1",
                    "subskillName": "React JSX & Component Hierarchy: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_jsx_comps_sub2",
                    "subskillName": "React JSX & Component Hierarchy: Component Structure & Memory",
                    "prerequisites": [
                      "react_jsx_comps_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_jsx_comps_sub3",
                    "subskillName": "React JSX & Component Hierarchy: Implementation Patterns & Flow",
                    "prerequisites": [
                      "react_jsx_comps_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_jsx_comps_sub4",
                    "subskillName": "React JSX & Component Hierarchy: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "react_jsx_comps_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_jsx_comps_sub5",
                    "subskillName": "React JSX & Component Hierarchy: Integration & Placement Questions",
                    "prerequisites": [
                      "react_jsx_comps_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_jsx_comps_sub6",
                    "subskillName": "React JSX & Component Hierarchy: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "react_jsx_comps_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "fullstack_sub_intermediate_2",
            "name": "React State & Core Concepts",
            "skills": [
              {
                "skillId": "react_props_state",
                "skillName": "React State & Props Management",
                "prerequisites": [
                  "react_jsx_comps"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "react_props_state_sub1",
                    "subskillName": "React State & Props Management: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_props_state_sub2",
                    "subskillName": "React State & Props Management: Component Structure & Memory",
                    "prerequisites": [
                      "react_props_state_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_props_state_sub3",
                    "subskillName": "React State & Props Management: Implementation Patterns & Flow",
                    "prerequisites": [
                      "react_props_state_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_props_state_sub4",
                    "subskillName": "React State & Props Management: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "react_props_state_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_props_state_sub5",
                    "subskillName": "React State & Props Management: Integration & Placement Questions",
                    "prerequisites": [
                      "react_props_state_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_props_state_sub6",
                    "subskillName": "React State & Props Management: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "react_props_state_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "react_hooks_core",
                "skillName": "React Hooks (useState & useEffect)",
                "prerequisites": [
                  "react_props_state"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "react_hooks_core_sub1",
                    "subskillName": "React Hooks (useState & useEffect): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_hooks_core_sub2",
                    "subskillName": "React Hooks (useState & useEffect): Component Structure & Memory",
                    "prerequisites": [
                      "react_hooks_core_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_hooks_core_sub3",
                    "subskillName": "React Hooks (useState & useEffect): Implementation Patterns & Flow",
                    "prerequisites": [
                      "react_hooks_core_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_hooks_core_sub4",
                    "subskillName": "React Hooks (useState & useEffect): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "react_hooks_core_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_hooks_core_sub5",
                    "subskillName": "React Hooks (useState & useEffect): Integration & Placement Questions",
                    "prerequisites": [
                      "react_hooks_core_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_hooks_core_sub6",
                    "subskillName": "React Hooks (useState & useEffect): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "react_hooks_core_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "react_router_arch",
                "skillName": "React Router & SPA Architecture",
                "prerequisites": [
                  "react_hooks_core"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "react_router_arch_sub1",
                    "subskillName": "React Router & SPA Architecture: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_router_arch_sub2",
                    "subskillName": "React Router & SPA Architecture: Component Structure & Memory",
                    "prerequisites": [
                      "react_router_arch_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_router_arch_sub3",
                    "subskillName": "React Router & SPA Architecture: Implementation Patterns & Flow",
                    "prerequisites": [
                      "react_router_arch_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_router_arch_sub4",
                    "subskillName": "React Router & SPA Architecture: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "react_router_arch_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_router_arch_sub5",
                    "subskillName": "React Router & SPA Architecture: Integration & Placement Questions",
                    "prerequisites": [
                      "react_router_arch_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "react_router_arch_sub6",
                    "subskillName": "React Router & SPA Architecture: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "react_router_arch_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "node_event_loop",
                "skillName": "Node.js Basics & Event Loop",
                "prerequisites": [
                  "js_promises_async"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "node_event_loop_sub1",
                    "subskillName": "Node.js Basics & Event Loop: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "node_event_loop_sub2",
                    "subskillName": "Node.js Basics & Event Loop: Component Structure & Memory",
                    "prerequisites": [
                      "node_event_loop_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "node_event_loop_sub3",
                    "subskillName": "Node.js Basics & Event Loop: Implementation Patterns & Flow",
                    "prerequisites": [
                      "node_event_loop_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "node_event_loop_sub4",
                    "subskillName": "Node.js Basics & Event Loop: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "node_event_loop_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "node_event_loop_sub5",
                    "subskillName": "Node.js Basics & Event Loop: Integration & Placement Questions",
                    "prerequisites": [
                      "node_event_loop_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "node_event_loop_sub6",
                    "subskillName": "Node.js Basics & Event Loop: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "node_event_loop_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "fullstack_sub_intermediate_3",
            "name": "Express Middleware & Core Concepts",
            "skills": [
              {
                "skillId": "express_rest_apis",
                "skillName": "Express Middleware & REST APIs",
                "prerequisites": [
                  "node_event_loop"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "express_rest_apis_sub1",
                    "subskillName": "Express Middleware & REST APIs: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "express_rest_apis_sub2",
                    "subskillName": "Express Middleware & REST APIs: Component Structure & Memory",
                    "prerequisites": [
                      "express_rest_apis_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "express_rest_apis_sub3",
                    "subskillName": "Express Middleware & REST APIs: Implementation Patterns & Flow",
                    "prerequisites": [
                      "express_rest_apis_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "express_rest_apis_sub4",
                    "subskillName": "Express Middleware & REST APIs: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "express_rest_apis_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "express_rest_apis_sub5",
                    "subskillName": "Express Middleware & REST APIs: Integration & Placement Questions",
                    "prerequisites": [
                      "express_rest_apis_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "express_rest_apis_sub6",
                    "subskillName": "Express Middleware & REST APIs: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "express_rest_apis_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "db_sql_relational",
                "skillName": "SQL Database Design & Queries",
                "prerequisites": [
                  "express_rest_apis"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "db_sql_relational_sub1",
                    "subskillName": "SQL Database Design & Queries: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_sql_relational_sub2",
                    "subskillName": "SQL Database Design & Queries: Component Structure & Memory",
                    "prerequisites": [
                      "db_sql_relational_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_sql_relational_sub3",
                    "subskillName": "SQL Database Design & Queries: Implementation Patterns & Flow",
                    "prerequisites": [
                      "db_sql_relational_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_sql_relational_sub4",
                    "subskillName": "SQL Database Design & Queries: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "db_sql_relational_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_sql_relational_sub5",
                    "subskillName": "SQL Database Design & Queries: Integration & Placement Questions",
                    "prerequisites": [
                      "db_sql_relational_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_sql_relational_sub6",
                    "subskillName": "SQL Database Design & Queries: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "db_sql_relational_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "db_mongo_nosql",
                "skillName": "MongoDB Document Schemas & Mongoose",
                "prerequisites": [
                  "express_rest_apis"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "db_mongo_nosql_sub1",
                    "subskillName": "MongoDB Document Schemas & Mongoose: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_mongo_nosql_sub2",
                    "subskillName": "MongoDB Document Schemas & Mongoose: Component Structure & Memory",
                    "prerequisites": [
                      "db_mongo_nosql_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_mongo_nosql_sub3",
                    "subskillName": "MongoDB Document Schemas & Mongoose: Implementation Patterns & Flow",
                    "prerequisites": [
                      "db_mongo_nosql_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_mongo_nosql_sub4",
                    "subskillName": "MongoDB Document Schemas & Mongoose: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "db_mongo_nosql_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_mongo_nosql_sub5",
                    "subskillName": "MongoDB Document Schemas & Mongoose: Integration & Placement Questions",
                    "prerequisites": [
                      "db_mongo_nosql_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "db_mongo_nosql_sub6",
                    "subskillName": "MongoDB Document Schemas & Mongoose: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "db_mongo_nosql_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_auth_jwt_sessions",
                "skillName": "JWT Authentication & Session Management",
                "prerequisites": [
                  "express_rest_apis",
                  "db_mongo_nosql"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "web_auth_jwt_sessions_sub1",
                    "subskillName": "JWT Authentication & Session Management: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sessions_sub2",
                    "subskillName": "JWT Authentication & Session Management: Component Structure & Memory",
                    "prerequisites": [
                      "web_auth_jwt_sessions_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sessions_sub3",
                    "subskillName": "JWT Authentication & Session Management: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_auth_jwt_sessions_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sessions_sub4",
                    "subskillName": "JWT Authentication & Session Management: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_auth_jwt_sessions_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sessions_sub5",
                    "subskillName": "JWT Authentication & Session Management: Integration & Placement Questions",
                    "prerequisites": [
                      "web_auth_jwt_sessions_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sessions_sub6",
                    "subskillName": "JWT Authentication & Session Management: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_auth_jwt_sessions_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "fullstack_top_advanced",
        "name": "Full-Stack Web Development — Advanced Tier",
        "subtopics": [
          {
            "id": "fullstack_sub_advanced_1",
            "name": "Authentication & Core Concepts",
            "skills": [
              {
                "skillId": "web_auth_jwt",
                "skillName": "Authentication & JWT Session Security",
                "prerequisites": [
                  "express_rest_apis",
                  "db_mongo_nosql"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_auth_jwt_sub1",
                    "subskillName": "Authentication & JWT Session Security: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sub2",
                    "subskillName": "Authentication & JWT Session Security: Component Structure & Memory",
                    "prerequisites": [
                      "web_auth_jwt_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sub3",
                    "subskillName": "Authentication & JWT Session Security: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_auth_jwt_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sub4",
                    "subskillName": "Authentication & JWT Session Security: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_auth_jwt_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sub5",
                    "subskillName": "Authentication & JWT Session Security: Integration & Placement Questions",
                    "prerequisites": [
                      "web_auth_jwt_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_auth_jwt_sub6",
                    "subskillName": "Authentication & JWT Session Security: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_auth_jwt_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_owasp_sec",
                "skillName": "XSS, CSRF, SQLi & CORS Security",
                "prerequisites": [
                  "web_auth_jwt"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_owasp_sec_sub1",
                    "subskillName": "XSS, CSRF, SQLi & CORS Security: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_owasp_sec_sub2",
                    "subskillName": "XSS, CSRF, SQLi & CORS Security: Component Structure & Memory",
                    "prerequisites": [
                      "web_owasp_sec_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_owasp_sec_sub3",
                    "subskillName": "XSS, CSRF, SQLi & CORS Security: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_owasp_sec_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_owasp_sec_sub4",
                    "subskillName": "XSS, CSRF, SQLi & CORS Security: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_owasp_sec_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_owasp_sec_sub5",
                    "subskillName": "XSS, CSRF, SQLi & CORS Security: Integration & Placement Questions",
                    "prerequisites": [
                      "web_owasp_sec_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_owasp_sec_sub6",
                    "subskillName": "XSS, CSRF, SQLi & CORS Security: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_owasp_sec_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "docker_containers",
                "skillName": "Docker Containerization for Web Apps",
                "prerequisites": [
                  "express_rest_apis"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "docker_containers_sub1",
                    "subskillName": "Docker Containerization for Web Apps: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "docker_containers_sub2",
                    "subskillName": "Docker Containerization for Web Apps: Component Structure & Memory",
                    "prerequisites": [
                      "docker_containers_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "docker_containers_sub3",
                    "subskillName": "Docker Containerization for Web Apps: Implementation Patterns & Flow",
                    "prerequisites": [
                      "docker_containers_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "docker_containers_sub4",
                    "subskillName": "Docker Containerization for Web Apps: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "docker_containers_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "docker_containers_sub5",
                    "subskillName": "Docker Containerization for Web Apps: Integration & Placement Questions",
                    "prerequisites": [
                      "docker_containers_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "docker_containers_sub6",
                    "subskillName": "Docker Containerization for Web Apps: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "docker_containers_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "fullstack_deployment",
                "skillName": "CI/CD Pipelines & Cloud Deployment",
                "prerequisites": [
                  "docker_containers"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "fullstack_deployment_sub1",
                    "subskillName": "CI/CD Pipelines & Cloud Deployment: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "fullstack_deployment_sub2",
                    "subskillName": "CI/CD Pipelines & Cloud Deployment: Component Structure & Memory",
                    "prerequisites": [
                      "fullstack_deployment_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "fullstack_deployment_sub3",
                    "subskillName": "CI/CD Pipelines & Cloud Deployment: Implementation Patterns & Flow",
                    "prerequisites": [
                      "fullstack_deployment_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "fullstack_deployment_sub4",
                    "subskillName": "CI/CD Pipelines & Cloud Deployment: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "fullstack_deployment_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "fullstack_deployment_sub5",
                    "subskillName": "CI/CD Pipelines & Cloud Deployment: Integration & Placement Questions",
                    "prerequisites": [
                      "fullstack_deployment_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "fullstack_deployment_sub6",
                    "subskillName": "CI/CD Pipelines & Cloud Deployment: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "fullstack_deployment_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "fullstack_sub_advanced_2",
            "name": "Next.js Server-Side Rendering & Core Concepts",
            "skills": [
              {
                "skillId": "web_ssr_nextjs",
                "skillName": "Next.js Server-Side Rendering & App Router",
                "prerequisites": [
                  "react_router_arch"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_ssr_nextjs_sub1",
                    "subskillName": "Next.js Server-Side Rendering & App Router: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ssr_nextjs_sub2",
                    "subskillName": "Next.js Server-Side Rendering & App Router: Component Structure & Memory",
                    "prerequisites": [
                      "web_ssr_nextjs_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ssr_nextjs_sub3",
                    "subskillName": "Next.js Server-Side Rendering & App Router: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_ssr_nextjs_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ssr_nextjs_sub4",
                    "subskillName": "Next.js Server-Side Rendering & App Router: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_ssr_nextjs_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ssr_nextjs_sub5",
                    "subskillName": "Next.js Server-Side Rendering & App Router: Integration & Placement Questions",
                    "prerequisites": [
                      "web_ssr_nextjs_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ssr_nextjs_sub6",
                    "subskillName": "Next.js Server-Side Rendering & App Router: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_ssr_nextjs_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_websockets_realtime",
                "skillName": "Real-Time Communication with WebSockets & Socket.io",
                "prerequisites": [
                  "express_rest_apis"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_websockets_realtime_sub1",
                    "subskillName": "Real-Time Communication with WebSockets & Socket.io: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_websockets_realtime_sub2",
                    "subskillName": "Real-Time Communication with WebSockets & Socket.io: Component Structure & Memory",
                    "prerequisites": [
                      "web_websockets_realtime_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_websockets_realtime_sub3",
                    "subskillName": "Real-Time Communication with WebSockets & Socket.io: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_websockets_realtime_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_websockets_realtime_sub4",
                    "subskillName": "Real-Time Communication with WebSockets & Socket.io: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_websockets_realtime_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_websockets_realtime_sub5",
                    "subskillName": "Real-Time Communication with WebSockets & Socket.io: Integration & Placement Questions",
                    "prerequisites": [
                      "web_websockets_realtime_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_websockets_realtime_sub6",
                    "subskillName": "Real-Time Communication with WebSockets & Socket.io: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_websockets_realtime_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_redis_caching",
                "skillName": "Redis In-Memory Caching & Session Stores",
                "prerequisites": [
                  "express_rest_apis",
                  "db_sql_relational"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_redis_caching_sub1",
                    "subskillName": "Redis In-Memory Caching & Session Stores: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_redis_caching_sub2",
                    "subskillName": "Redis In-Memory Caching & Session Stores: Component Structure & Memory",
                    "prerequisites": [
                      "web_redis_caching_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_redis_caching_sub3",
                    "subskillName": "Redis In-Memory Caching & Session Stores: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_redis_caching_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_redis_caching_sub4",
                    "subskillName": "Redis In-Memory Caching & Session Stores: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_redis_caching_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_redis_caching_sub5",
                    "subskillName": "Redis In-Memory Caching & Session Stores: Integration & Placement Questions",
                    "prerequisites": [
                      "web_redis_caching_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_redis_caching_sub6",
                    "subskillName": "Redis In-Memory Caching & Session Stores: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_redis_caching_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_microservices_events",
                "skillName": "Microservices Architecture & Event-Driven Brokers",
                "prerequisites": [
                  "docker_containers",
                  "express_rest_apis"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_microservices_events_sub1",
                    "subskillName": "Microservices Architecture & Event-Driven Brokers: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_microservices_events_sub2",
                    "subskillName": "Microservices Architecture & Event-Driven Brokers: Component Structure & Memory",
                    "prerequisites": [
                      "web_microservices_events_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_microservices_events_sub3",
                    "subskillName": "Microservices Architecture & Event-Driven Brokers: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_microservices_events_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_microservices_events_sub4",
                    "subskillName": "Microservices Architecture & Event-Driven Brokers: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_microservices_events_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_microservices_events_sub5",
                    "subskillName": "Microservices Architecture & Event-Driven Brokers: Integration & Placement Questions",
                    "prerequisites": [
                      "web_microservices_events_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_microservices_events_sub6",
                    "subskillName": "Microservices Architecture & Event-Driven Brokers: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_microservices_events_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "fullstack_sub_advanced_3",
            "name": "GraphQL Schemas, Queries & Core Concepts",
            "skills": [
              {
                "skillId": "web_graphql_apis",
                "skillName": "GraphQL Schemas, Queries & Apollo Integration",
                "prerequisites": [
                  "express_rest_apis"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_graphql_apis_sub1",
                    "subskillName": "GraphQL Schemas, Queries & Apollo Integration: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_graphql_apis_sub2",
                    "subskillName": "GraphQL Schemas, Queries & Apollo Integration: Component Structure & Memory",
                    "prerequisites": [
                      "web_graphql_apis_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_graphql_apis_sub3",
                    "subskillName": "GraphQL Schemas, Queries & Apollo Integration: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_graphql_apis_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_graphql_apis_sub4",
                    "subskillName": "GraphQL Schemas, Queries & Apollo Integration: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_graphql_apis_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_graphql_apis_sub5",
                    "subskillName": "GraphQL Schemas, Queries & Apollo Integration: Integration & Placement Questions",
                    "prerequisites": [
                      "web_graphql_apis_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_graphql_apis_sub6",
                    "subskillName": "GraphQL Schemas, Queries & Apollo Integration: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_graphql_apis_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_ci_cd_pipelines",
                "skillName": "Automated GitHub Actions CI/CD Pipeline Workflows",
                "prerequisites": [
                  "docker_containers"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_ci_cd_pipelines_sub1",
                    "subskillName": "Automated GitHub Actions CI/CD Pipeline Workflows: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ci_cd_pipelines_sub2",
                    "subskillName": "Automated GitHub Actions CI/CD Pipeline Workflows: Component Structure & Memory",
                    "prerequisites": [
                      "web_ci_cd_pipelines_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ci_cd_pipelines_sub3",
                    "subskillName": "Automated GitHub Actions CI/CD Pipeline Workflows: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_ci_cd_pipelines_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ci_cd_pipelines_sub4",
                    "subskillName": "Automated GitHub Actions CI/CD Pipeline Workflows: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_ci_cd_pipelines_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ci_cd_pipelines_sub5",
                    "subskillName": "Automated GitHub Actions CI/CD Pipeline Workflows: Integration & Placement Questions",
                    "prerequisites": [
                      "web_ci_cd_pipelines_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_ci_cd_pipelines_sub6",
                    "subskillName": "Automated GitHub Actions CI/CD Pipeline Workflows: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_ci_cd_pipelines_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_observability_logging",
                "skillName": "Production Observability, APM & OpenTelemetry",
                "prerequisites": [
                  "fullstack_deployment"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_observability_logging_sub1",
                    "subskillName": "Production Observability, APM & OpenTelemetry: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_observability_logging_sub2",
                    "subskillName": "Production Observability, APM & OpenTelemetry: Component Structure & Memory",
                    "prerequisites": [
                      "web_observability_logging_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_observability_logging_sub3",
                    "subskillName": "Production Observability, APM & OpenTelemetry: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_observability_logging_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_observability_logging_sub4",
                    "subskillName": "Production Observability, APM & OpenTelemetry: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_observability_logging_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_observability_logging_sub5",
                    "subskillName": "Production Observability, APM & OpenTelemetry: Integration & Placement Questions",
                    "prerequisites": [
                      "web_observability_logging_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_observability_logging_sub6",
                    "subskillName": "Production Observability, APM & OpenTelemetry: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_observability_logging_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "web_scale_load_balancing",
                "skillName": "High-Throughput Load Balancing & Horizontal Scaling",
                "prerequisites": [
                  "fullstack_deployment"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "web_scale_load_balancing_sub1",
                    "subskillName": "High-Throughput Load Balancing & Horizontal Scaling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_scale_load_balancing_sub2",
                    "subskillName": "High-Throughput Load Balancing & Horizontal Scaling: Component Structure & Memory",
                    "prerequisites": [
                      "web_scale_load_balancing_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_scale_load_balancing_sub3",
                    "subskillName": "High-Throughput Load Balancing & Horizontal Scaling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "web_scale_load_balancing_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_scale_load_balancing_sub4",
                    "subskillName": "High-Throughput Load Balancing & Horizontal Scaling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "web_scale_load_balancing_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_scale_load_balancing_sub5",
                    "subskillName": "High-Throughput Load Balancing & Horizontal Scaling: Integration & Placement Questions",
                    "prerequisites": [
                      "web_scale_load_balancing_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "web_scale_load_balancing_sub6",
                    "subskillName": "High-Throughput Load Balancing & Horizontal Scaling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "web_scale_load_balancing_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "datascience": {
    "domainId": "datascience",
    "domainName": "Data Science & Machine Learning",
    "topics": [
      {
        "id": "datascience_top_beginner",
        "name": "Data Science & Machine Learning — Beginner Tier",
        "subtopics": [
          {
            "id": "datascience_sub_beginner_1",
            "name": "Python Syntax & Core Concepts",
            "skills": [
              {
                "skillId": "py_vars_primitives",
                "skillName": "Python Syntax & Primitive Data Types",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "py_vars_primitives_sub1",
                    "subskillName": "Python Syntax & Primitive Data Types: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_vars_primitives_sub2",
                    "subskillName": "Python Syntax & Primitive Data Types: Component Structure & Memory",
                    "prerequisites": [
                      "py_vars_primitives_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_vars_primitives_sub3",
                    "subskillName": "Python Syntax & Primitive Data Types: Implementation Patterns & Flow",
                    "prerequisites": [
                      "py_vars_primitives_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_vars_primitives_sub4",
                    "subskillName": "Python Syntax & Primitive Data Types: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "py_vars_primitives_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_vars_primitives_sub5",
                    "subskillName": "Python Syntax & Primitive Data Types: Integration & Placement Questions",
                    "prerequisites": [
                      "py_vars_primitives_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_vars_primitives_sub6",
                    "subskillName": "Python Syntax & Primitive Data Types: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "py_vars_primitives_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "py_control_loops",
                "skillName": "Control Flow (if/else, loops)",
                "prerequisites": [
                  "py_vars_primitives"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "py_control_loops_sub1",
                    "subskillName": "Control Flow (if/else, loops): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_control_loops_sub2",
                    "subskillName": "Control Flow (if/else, loops): Component Structure & Memory",
                    "prerequisites": [
                      "py_control_loops_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_control_loops_sub3",
                    "subskillName": "Control Flow (if/else, loops): Implementation Patterns & Flow",
                    "prerequisites": [
                      "py_control_loops_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_control_loops_sub4",
                    "subskillName": "Control Flow (if/else, loops): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "py_control_loops_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_control_loops_sub5",
                    "subskillName": "Control Flow (if/else, loops): Integration & Placement Questions",
                    "prerequisites": [
                      "py_control_loops_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_control_loops_sub6",
                    "subskillName": "Control Flow (if/else, loops): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "py_control_loops_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "py_funcs_modules",
                "skillName": "Python Functions & Scope",
                "prerequisites": [
                  "py_control_loops"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "py_funcs_modules_sub1",
                    "subskillName": "Python Functions & Scope: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_funcs_modules_sub2",
                    "subskillName": "Python Functions & Scope: Component Structure & Memory",
                    "prerequisites": [
                      "py_funcs_modules_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_funcs_modules_sub3",
                    "subskillName": "Python Functions & Scope: Implementation Patterns & Flow",
                    "prerequisites": [
                      "py_funcs_modules_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_funcs_modules_sub4",
                    "subskillName": "Python Functions & Scope: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "py_funcs_modules_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_funcs_modules_sub5",
                    "subskillName": "Python Functions & Scope: Integration & Placement Questions",
                    "prerequisites": [
                      "py_funcs_modules_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_funcs_modules_sub6",
                    "subskillName": "Python Functions & Scope: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "py_funcs_modules_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "py_structs_lists",
                "skillName": "Python Data Structures (Lists, Dicts, Sets)",
                "prerequisites": [
                  "py_funcs_modules"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "py_structs_lists_sub1",
                    "subskillName": "Python Data Structures (Lists, Dicts, Sets): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_structs_lists_sub2",
                    "subskillName": "Python Data Structures (Lists, Dicts, Sets): Component Structure & Memory",
                    "prerequisites": [
                      "py_structs_lists_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_structs_lists_sub3",
                    "subskillName": "Python Data Structures (Lists, Dicts, Sets): Implementation Patterns & Flow",
                    "prerequisites": [
                      "py_structs_lists_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_structs_lists_sub4",
                    "subskillName": "Python Data Structures (Lists, Dicts, Sets): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "py_structs_lists_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_structs_lists_sub5",
                    "subskillName": "Python Data Structures (Lists, Dicts, Sets): Integration & Placement Questions",
                    "prerequisites": [
                      "py_structs_lists_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "py_structs_lists_sub6",
                    "subskillName": "Python Data Structures (Lists, Dicts, Sets): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "py_structs_lists_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "datascience_sub_beginner_2",
            "name": "NumPy Arrays & Core Concepts",
            "skills": [
              {
                "skillId": "np_vectorized_ops",
                "skillName": "NumPy Arrays & Linear Math",
                "prerequisites": [
                  "py_structs_lists"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "np_vectorized_ops_sub1",
                    "subskillName": "NumPy Arrays & Linear Math: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "np_vectorized_ops_sub2",
                    "subskillName": "NumPy Arrays & Linear Math: Component Structure & Memory",
                    "prerequisites": [
                      "np_vectorized_ops_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "np_vectorized_ops_sub3",
                    "subskillName": "NumPy Arrays & Linear Math: Implementation Patterns & Flow",
                    "prerequisites": [
                      "np_vectorized_ops_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "np_vectorized_ops_sub4",
                    "subskillName": "NumPy Arrays & Linear Math: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "np_vectorized_ops_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "np_vectorized_ops_sub5",
                    "subskillName": "NumPy Arrays & Linear Math: Integration & Placement Questions",
                    "prerequisites": [
                      "np_vectorized_ops_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "np_vectorized_ops_sub6",
                    "subskillName": "NumPy Arrays & Linear Math: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "np_vectorized_ops_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_py_file_io",
                "skillName": "Python File I/O, CSV & JSON Handling",
                "prerequisites": [
                  "py_structs_lists"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ds_py_file_io_sub1",
                    "subskillName": "Python File I/O, CSV & JSON Handling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_py_file_io_sub2",
                    "subskillName": "Python File I/O, CSV & JSON Handling: Component Structure & Memory",
                    "prerequisites": [
                      "ds_py_file_io_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_py_file_io_sub3",
                    "subskillName": "Python File I/O, CSV & JSON Handling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_py_file_io_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_py_file_io_sub4",
                    "subskillName": "Python File I/O, CSV & JSON Handling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_py_file_io_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_py_file_io_sub5",
                    "subskillName": "Python File I/O, CSV & JSON Handling: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_py_file_io_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_py_file_io_sub6",
                    "subskillName": "Python File I/O, CSV & JSON Handling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_py_file_io_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_numpy_linear_algebra",
                "skillName": "NumPy Matrix Operations & Linear Algebra",
                "prerequisites": [
                  "np_vectorized_ops"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ds_numpy_linear_algebra_sub1",
                    "subskillName": "NumPy Matrix Operations & Linear Algebra: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_numpy_linear_algebra_sub2",
                    "subskillName": "NumPy Matrix Operations & Linear Algebra: Component Structure & Memory",
                    "prerequisites": [
                      "ds_numpy_linear_algebra_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_numpy_linear_algebra_sub3",
                    "subskillName": "NumPy Matrix Operations & Linear Algebra: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_numpy_linear_algebra_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_numpy_linear_algebra_sub4",
                    "subskillName": "NumPy Matrix Operations & Linear Algebra: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_numpy_linear_algebra_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_numpy_linear_algebra_sub5",
                    "subskillName": "NumPy Matrix Operations & Linear Algebra: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_numpy_linear_algebra_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_numpy_linear_algebra_sub6",
                    "subskillName": "NumPy Matrix Operations & Linear Algebra: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_numpy_linear_algebra_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_math_probability",
                "skillName": "Probability Foundations & Distributions",
                "prerequisites": [
                  "py_funcs_modules"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ds_math_probability_sub1",
                    "subskillName": "Probability Foundations & Distributions: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_probability_sub2",
                    "subskillName": "Probability Foundations & Distributions: Component Structure & Memory",
                    "prerequisites": [
                      "ds_math_probability_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_probability_sub3",
                    "subskillName": "Probability Foundations & Distributions: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_math_probability_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_probability_sub4",
                    "subskillName": "Probability Foundations & Distributions: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_math_probability_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_probability_sub5",
                    "subskillName": "Probability Foundations & Distributions: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_math_probability_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_probability_sub6",
                    "subskillName": "Probability Foundations & Distributions: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_math_probability_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "datascience_sub_beginner_3",
            "name": "Calculus, Derivatives & Core Concepts",
            "skills": [
              {
                "skillId": "ds_math_calculus",
                "skillName": "Calculus, Derivatives & Gradient Optimization",
                "prerequisites": [
                  "np_vectorized_ops"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ds_math_calculus_sub1",
                    "subskillName": "Calculus, Derivatives & Gradient Optimization: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_calculus_sub2",
                    "subskillName": "Calculus, Derivatives & Gradient Optimization: Component Structure & Memory",
                    "prerequisites": [
                      "ds_math_calculus_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_calculus_sub3",
                    "subskillName": "Calculus, Derivatives & Gradient Optimization: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_math_calculus_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_calculus_sub4",
                    "subskillName": "Calculus, Derivatives & Gradient Optimization: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_math_calculus_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_calculus_sub5",
                    "subskillName": "Calculus, Derivatives & Gradient Optimization: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_math_calculus_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_math_calculus_sub6",
                    "subskillName": "Calculus, Derivatives & Gradient Optimization: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_math_calculus_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_sql_extraction",
                "skillName": "SQL Queries, Joins & Relational Extraction",
                "prerequisites": [
                  "py_structs_lists"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ds_sql_extraction_sub1",
                    "subskillName": "SQL Queries, Joins & Relational Extraction: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_sql_extraction_sub2",
                    "subskillName": "SQL Queries, Joins & Relational Extraction: Component Structure & Memory",
                    "prerequisites": [
                      "ds_sql_extraction_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_sql_extraction_sub3",
                    "subskillName": "SQL Queries, Joins & Relational Extraction: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_sql_extraction_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_sql_extraction_sub4",
                    "subskillName": "SQL Queries, Joins & Relational Extraction: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_sql_extraction_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_sql_extraction_sub5",
                    "subskillName": "SQL Queries, Joins & Relational Extraction: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_sql_extraction_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_sql_extraction_sub6",
                    "subskillName": "SQL Queries, Joins & Relational Extraction: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_sql_extraction_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_eda_matplotlib",
                "skillName": "Data Visualization with Matplotlib",
                "prerequisites": [
                  "np_vectorized_ops"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ds_eda_matplotlib_sub1",
                    "subskillName": "Data Visualization with Matplotlib: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_matplotlib_sub2",
                    "subskillName": "Data Visualization with Matplotlib: Component Structure & Memory",
                    "prerequisites": [
                      "ds_eda_matplotlib_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_matplotlib_sub3",
                    "subskillName": "Data Visualization with Matplotlib: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_eda_matplotlib_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_matplotlib_sub4",
                    "subskillName": "Data Visualization with Matplotlib: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_eda_matplotlib_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_matplotlib_sub5",
                    "subskillName": "Data Visualization with Matplotlib: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_eda_matplotlib_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_matplotlib_sub6",
                    "subskillName": "Data Visualization with Matplotlib: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_eda_matplotlib_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_eda_seaborn",
                "skillName": "Statistical Visualizations & Heatmaps with Seaborn",
                "prerequisites": [
                  "ds_eda_matplotlib"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ds_eda_seaborn_sub1",
                    "subskillName": "Statistical Visualizations & Heatmaps with Seaborn: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_seaborn_sub2",
                    "subskillName": "Statistical Visualizations & Heatmaps with Seaborn: Component Structure & Memory",
                    "prerequisites": [
                      "ds_eda_seaborn_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_seaborn_sub3",
                    "subskillName": "Statistical Visualizations & Heatmaps with Seaborn: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_eda_seaborn_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_seaborn_sub4",
                    "subskillName": "Statistical Visualizations & Heatmaps with Seaborn: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_eda_seaborn_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_seaborn_sub5",
                    "subskillName": "Statistical Visualizations & Heatmaps with Seaborn: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_eda_seaborn_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_eda_seaborn_sub6",
                    "subskillName": "Statistical Visualizations & Heatmaps with Seaborn: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_eda_seaborn_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "datascience_top_intermediate",
        "name": "Data Science & Machine Learning — Intermediate Tier",
        "subtopics": [
          {
            "id": "datascience_sub_intermediate_1",
            "name": "Pandas DataFrames & Core Concepts",
            "skills": [
              {
                "skillId": "pd_df_manipulation",
                "skillName": "Pandas DataFrames & Manipulation",
                "prerequisites": [
                  "np_vectorized_ops"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "pd_df_manipulation_sub1",
                    "subskillName": "Pandas DataFrames & Manipulation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_df_manipulation_sub2",
                    "subskillName": "Pandas DataFrames & Manipulation: Component Structure & Memory",
                    "prerequisites": [
                      "pd_df_manipulation_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_df_manipulation_sub3",
                    "subskillName": "Pandas DataFrames & Manipulation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "pd_df_manipulation_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_df_manipulation_sub4",
                    "subskillName": "Pandas DataFrames & Manipulation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "pd_df_manipulation_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_df_manipulation_sub5",
                    "subskillName": "Pandas DataFrames & Manipulation: Integration & Placement Questions",
                    "prerequisites": [
                      "pd_df_manipulation_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_df_manipulation_sub6",
                    "subskillName": "Pandas DataFrames & Manipulation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "pd_df_manipulation_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "pd_cleaning_eda",
                "skillName": "Data Cleaning, Filtering & EDA",
                "prerequisites": [
                  "pd_df_manipulation"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "pd_cleaning_eda_sub1",
                    "subskillName": "Data Cleaning, Filtering & EDA: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_cleaning_eda_sub2",
                    "subskillName": "Data Cleaning, Filtering & EDA: Component Structure & Memory",
                    "prerequisites": [
                      "pd_cleaning_eda_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_cleaning_eda_sub3",
                    "subskillName": "Data Cleaning, Filtering & EDA: Implementation Patterns & Flow",
                    "prerequisites": [
                      "pd_cleaning_eda_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_cleaning_eda_sub4",
                    "subskillName": "Data Cleaning, Filtering & EDA: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "pd_cleaning_eda_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_cleaning_eda_sub5",
                    "subskillName": "Data Cleaning, Filtering & EDA: Integration & Placement Questions",
                    "prerequisites": [
                      "pd_cleaning_eda_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "pd_cleaning_eda_sub6",
                    "subskillName": "Data Cleaning, Filtering & EDA: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "pd_cleaning_eda_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "stat_desc_inf",
                "skillName": "Descriptive & Inferential Statistics",
                "prerequisites": [
                  "pd_cleaning_eda"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "stat_desc_inf_sub1",
                    "subskillName": "Descriptive & Inferential Statistics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_desc_inf_sub2",
                    "subskillName": "Descriptive & Inferential Statistics: Component Structure & Memory",
                    "prerequisites": [
                      "stat_desc_inf_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_desc_inf_sub3",
                    "subskillName": "Descriptive & Inferential Statistics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "stat_desc_inf_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_desc_inf_sub4",
                    "subskillName": "Descriptive & Inferential Statistics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "stat_desc_inf_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_desc_inf_sub5",
                    "subskillName": "Descriptive & Inferential Statistics: Integration & Placement Questions",
                    "prerequisites": [
                      "stat_desc_inf_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_desc_inf_sub6",
                    "subskillName": "Descriptive & Inferential Statistics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "stat_desc_inf_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "stat_hyp_testing",
                "skillName": "Hypothesis Testing & p-values",
                "prerequisites": [
                  "stat_desc_inf"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "stat_hyp_testing_sub1",
                    "subskillName": "Hypothesis Testing & p-values: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_hyp_testing_sub2",
                    "subskillName": "Hypothesis Testing & p-values: Component Structure & Memory",
                    "prerequisites": [
                      "stat_hyp_testing_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_hyp_testing_sub3",
                    "subskillName": "Hypothesis Testing & p-values: Implementation Patterns & Flow",
                    "prerequisites": [
                      "stat_hyp_testing_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_hyp_testing_sub4",
                    "subskillName": "Hypothesis Testing & p-values: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "stat_hyp_testing_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_hyp_testing_sub5",
                    "subskillName": "Hypothesis Testing & p-values: Integration & Placement Questions",
                    "prerequisites": [
                      "stat_hyp_testing_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "stat_hyp_testing_sub6",
                    "subskillName": "Hypothesis Testing & p-values: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "stat_hyp_testing_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "datascience_sub_intermediate_2",
            "name": "Linear & Core Concepts",
            "skills": [
              {
                "skillId": "ml_lin_log_reg",
                "skillName": "Linear & Logistic Regression",
                "prerequisites": [
                  "stat_hyp_testing"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ml_lin_log_reg_sub1",
                    "subskillName": "Linear & Logistic Regression: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_lin_log_reg_sub2",
                    "subskillName": "Linear & Logistic Regression: Component Structure & Memory",
                    "prerequisites": [
                      "ml_lin_log_reg_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_lin_log_reg_sub3",
                    "subskillName": "Linear & Logistic Regression: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ml_lin_log_reg_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_lin_log_reg_sub4",
                    "subskillName": "Linear & Logistic Regression: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ml_lin_log_reg_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_lin_log_reg_sub5",
                    "subskillName": "Linear & Logistic Regression: Integration & Placement Questions",
                    "prerequisites": [
                      "ml_lin_log_reg_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_lin_log_reg_sub6",
                    "subskillName": "Linear & Logistic Regression: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ml_lin_log_reg_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ml_trees_forests",
                "skillName": "Decision Trees & Random Forests",
                "prerequisites": [
                  "ml_lin_log_reg"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ml_trees_forests_sub1",
                    "subskillName": "Decision Trees & Random Forests: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_trees_forests_sub2",
                    "subskillName": "Decision Trees & Random Forests: Component Structure & Memory",
                    "prerequisites": [
                      "ml_trees_forests_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_trees_forests_sub3",
                    "subskillName": "Decision Trees & Random Forests: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ml_trees_forests_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_trees_forests_sub4",
                    "subskillName": "Decision Trees & Random Forests: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ml_trees_forests_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_trees_forests_sub5",
                    "subskillName": "Decision Trees & Random Forests: Integration & Placement Questions",
                    "prerequisites": [
                      "ml_trees_forests_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_trees_forests_sub6",
                    "subskillName": "Decision Trees & Random Forests: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ml_trees_forests_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_feature_engineering",
                "skillName": "Feature Engineering, Scaling & Categorical Encoders",
                "prerequisites": [
                  "pd_cleaning_eda"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ds_feature_engineering_sub1",
                    "subskillName": "Feature Engineering, Scaling & Categorical Encoders: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_feature_engineering_sub2",
                    "subskillName": "Feature Engineering, Scaling & Categorical Encoders: Component Structure & Memory",
                    "prerequisites": [
                      "ds_feature_engineering_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_feature_engineering_sub3",
                    "subskillName": "Feature Engineering, Scaling & Categorical Encoders: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_feature_engineering_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_feature_engineering_sub4",
                    "subskillName": "Feature Engineering, Scaling & Categorical Encoders: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_feature_engineering_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_feature_engineering_sub5",
                    "subskillName": "Feature Engineering, Scaling & Categorical Encoders: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_feature_engineering_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_feature_engineering_sub6",
                    "subskillName": "Feature Engineering, Scaling & Categorical Encoders: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_feature_engineering_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_cross_validation",
                "skillName": "Cross-Validation, ROC-AUC & Model Selection",
                "prerequisites": [
                  "ml_lin_log_reg"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ds_cross_validation_sub1",
                    "subskillName": "Cross-Validation, ROC-AUC & Model Selection: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_cross_validation_sub2",
                    "subskillName": "Cross-Validation, ROC-AUC & Model Selection: Component Structure & Memory",
                    "prerequisites": [
                      "ds_cross_validation_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_cross_validation_sub3",
                    "subskillName": "Cross-Validation, ROC-AUC & Model Selection: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_cross_validation_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_cross_validation_sub4",
                    "subskillName": "Cross-Validation, ROC-AUC & Model Selection: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_cross_validation_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_cross_validation_sub5",
                    "subskillName": "Cross-Validation, ROC-AUC & Model Selection: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_cross_validation_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_cross_validation_sub6",
                    "subskillName": "Cross-Validation, ROC-AUC & Model Selection: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_cross_validation_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "datascience_sub_intermediate_3",
            "name": "K-Means & Core Concepts",
            "skills": [
              {
                "skillId": "ds_clustering_kmeans",
                "skillName": "K-Means & Hierarchical Unsupervised Clustering",
                "prerequisites": [
                  "ml_trees_forests"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ds_clustering_kmeans_sub1",
                    "subskillName": "K-Means & Hierarchical Unsupervised Clustering: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_clustering_kmeans_sub2",
                    "subskillName": "K-Means & Hierarchical Unsupervised Clustering: Component Structure & Memory",
                    "prerequisites": [
                      "ds_clustering_kmeans_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_clustering_kmeans_sub3",
                    "subskillName": "K-Means & Hierarchical Unsupervised Clustering: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_clustering_kmeans_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_clustering_kmeans_sub4",
                    "subskillName": "K-Means & Hierarchical Unsupervised Clustering: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_clustering_kmeans_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_clustering_kmeans_sub5",
                    "subskillName": "K-Means & Hierarchical Unsupervised Clustering: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_clustering_kmeans_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_clustering_kmeans_sub6",
                    "subskillName": "K-Means & Hierarchical Unsupervised Clustering: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_clustering_kmeans_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_pca_reduction",
                "skillName": "Principal Component Analysis & Dimensionality Reduction",
                "prerequisites": [
                  "ds_clustering_kmeans"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ds_pca_reduction_sub1",
                    "subskillName": "Principal Component Analysis & Dimensionality Reduction: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pca_reduction_sub2",
                    "subskillName": "Principal Component Analysis & Dimensionality Reduction: Component Structure & Memory",
                    "prerequisites": [
                      "ds_pca_reduction_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pca_reduction_sub3",
                    "subskillName": "Principal Component Analysis & Dimensionality Reduction: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_pca_reduction_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pca_reduction_sub4",
                    "subskillName": "Principal Component Analysis & Dimensionality Reduction: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_pca_reduction_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pca_reduction_sub5",
                    "subskillName": "Principal Component Analysis & Dimensionality Reduction: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_pca_reduction_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pca_reduction_sub6",
                    "subskillName": "Principal Component Analysis & Dimensionality Reduction: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_pca_reduction_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_time_series_arima",
                "skillName": "Time Series Analysis, Seasonality & ARIMA Modeling",
                "prerequisites": [
                  "ml_lin_log_reg"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ds_time_series_arima_sub1",
                    "subskillName": "Time Series Analysis, Seasonality & ARIMA Modeling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_time_series_arima_sub2",
                    "subskillName": "Time Series Analysis, Seasonality & ARIMA Modeling: Component Structure & Memory",
                    "prerequisites": [
                      "ds_time_series_arima_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_time_series_arima_sub3",
                    "subskillName": "Time Series Analysis, Seasonality & ARIMA Modeling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_time_series_arima_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_time_series_arima_sub4",
                    "subskillName": "Time Series Analysis, Seasonality & ARIMA Modeling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_time_series_arima_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_time_series_arima_sub5",
                    "subskillName": "Time Series Analysis, Seasonality & ARIMA Modeling: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_time_series_arima_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_time_series_arima_sub6",
                    "subskillName": "Time Series Analysis, Seasonality & ARIMA Modeling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_time_series_arima_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_nlp_text_preprocessing",
                "skillName": "NLP Preprocessing, TF-IDF & Word Embeddings",
                "prerequisites": [
                  "pd_cleaning_eda"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ds_nlp_text_preprocessing_sub1",
                    "subskillName": "NLP Preprocessing, TF-IDF & Word Embeddings: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_nlp_text_preprocessing_sub2",
                    "subskillName": "NLP Preprocessing, TF-IDF & Word Embeddings: Component Structure & Memory",
                    "prerequisites": [
                      "ds_nlp_text_preprocessing_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_nlp_text_preprocessing_sub3",
                    "subskillName": "NLP Preprocessing, TF-IDF & Word Embeddings: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_nlp_text_preprocessing_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_nlp_text_preprocessing_sub4",
                    "subskillName": "NLP Preprocessing, TF-IDF & Word Embeddings: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_nlp_text_preprocessing_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_nlp_text_preprocessing_sub5",
                    "subskillName": "NLP Preprocessing, TF-IDF & Word Embeddings: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_nlp_text_preprocessing_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_nlp_text_preprocessing_sub6",
                    "subskillName": "NLP Preprocessing, TF-IDF & Word Embeddings: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_nlp_text_preprocessing_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "datascience_top_advanced",
        "name": "Data Science & Machine Learning — Advanced Tier",
        "subtopics": [
          {
            "id": "datascience_sub_advanced_1",
            "name": "Gradient Boosting (XGBoost/LightGBM) & Core Concepts",
            "skills": [
              {
                "skillId": "ml_grad_boosting",
                "skillName": "Gradient Boosting (XGBoost/LightGBM)",
                "prerequisites": [
                  "ml_trees_forests"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ml_grad_boosting_sub1",
                    "subskillName": "Gradient Boosting (XGBoost/LightGBM): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_grad_boosting_sub2",
                    "subskillName": "Gradient Boosting (XGBoost/LightGBM): Component Structure & Memory",
                    "prerequisites": [
                      "ml_grad_boosting_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_grad_boosting_sub3",
                    "subskillName": "Gradient Boosting (XGBoost/LightGBM): Implementation Patterns & Flow",
                    "prerequisites": [
                      "ml_grad_boosting_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_grad_boosting_sub4",
                    "subskillName": "Gradient Boosting (XGBoost/LightGBM): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ml_grad_boosting_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_grad_boosting_sub5",
                    "subskillName": "Gradient Boosting (XGBoost/LightGBM): Integration & Placement Questions",
                    "prerequisites": [
                      "ml_grad_boosting_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_grad_boosting_sub6",
                    "subskillName": "Gradient Boosting (XGBoost/LightGBM): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ml_grad_boosting_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ml_hyper_tuning",
                "skillName": "Hyperparameter Tuning & Cross-Validation",
                "prerequisites": [
                  "ml_grad_boosting"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ml_hyper_tuning_sub1",
                    "subskillName": "Hyperparameter Tuning & Cross-Validation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_hyper_tuning_sub2",
                    "subskillName": "Hyperparameter Tuning & Cross-Validation: Component Structure & Memory",
                    "prerequisites": [
                      "ml_hyper_tuning_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_hyper_tuning_sub3",
                    "subskillName": "Hyperparameter Tuning & Cross-Validation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ml_hyper_tuning_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_hyper_tuning_sub4",
                    "subskillName": "Hyperparameter Tuning & Cross-Validation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ml_hyper_tuning_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_hyper_tuning_sub5",
                    "subskillName": "Hyperparameter Tuning & Cross-Validation: Integration & Placement Questions",
                    "prerequisites": [
                      "ml_hyper_tuning_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ml_hyper_tuning_sub6",
                    "subskillName": "Hyperparameter Tuning & Cross-Validation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ml_hyper_tuning_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dl_ann_backprop",
                "skillName": "Neural Networks & Backpropagation",
                "prerequisites": [
                  "ml_hyper_tuning"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dl_ann_backprop_sub1",
                    "subskillName": "Neural Networks & Backpropagation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_ann_backprop_sub2",
                    "subskillName": "Neural Networks & Backpropagation: Component Structure & Memory",
                    "prerequisites": [
                      "dl_ann_backprop_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_ann_backprop_sub3",
                    "subskillName": "Neural Networks & Backpropagation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dl_ann_backprop_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_ann_backprop_sub4",
                    "subskillName": "Neural Networks & Backpropagation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dl_ann_backprop_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_ann_backprop_sub5",
                    "subskillName": "Neural Networks & Backpropagation: Integration & Placement Questions",
                    "prerequisites": [
                      "dl_ann_backprop_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_ann_backprop_sub6",
                    "subskillName": "Neural Networks & Backpropagation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dl_ann_backprop_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dl_cnn_vision",
                "skillName": "CNNs for Computer Vision",
                "prerequisites": [
                  "dl_ann_backprop"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dl_cnn_vision_sub1",
                    "subskillName": "CNNs for Computer Vision: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_cnn_vision_sub2",
                    "subskillName": "CNNs for Computer Vision: Component Structure & Memory",
                    "prerequisites": [
                      "dl_cnn_vision_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_cnn_vision_sub3",
                    "subskillName": "CNNs for Computer Vision: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dl_cnn_vision_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_cnn_vision_sub4",
                    "subskillName": "CNNs for Computer Vision: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dl_cnn_vision_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_cnn_vision_sub5",
                    "subskillName": "CNNs for Computer Vision: Integration & Placement Questions",
                    "prerequisites": [
                      "dl_cnn_vision_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dl_cnn_vision_sub6",
                    "subskillName": "CNNs for Computer Vision: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dl_cnn_vision_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "datascience_sub_advanced_2",
            "name": "Transformers & Core Concepts",
            "skills": [
              {
                "skillId": "nlp_transformers_llm",
                "skillName": "Transformers & LLM Fine-Tuning",
                "prerequisites": [
                  "dl_ann_backprop"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "nlp_transformers_llm_sub1",
                    "subskillName": "Transformers & LLM Fine-Tuning: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "nlp_transformers_llm_sub2",
                    "subskillName": "Transformers & LLM Fine-Tuning: Component Structure & Memory",
                    "prerequisites": [
                      "nlp_transformers_llm_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "nlp_transformers_llm_sub3",
                    "subskillName": "Transformers & LLM Fine-Tuning: Implementation Patterns & Flow",
                    "prerequisites": [
                      "nlp_transformers_llm_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "nlp_transformers_llm_sub4",
                    "subskillName": "Transformers & LLM Fine-Tuning: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "nlp_transformers_llm_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "nlp_transformers_llm_sub5",
                    "subskillName": "Transformers & LLM Fine-Tuning: Integration & Placement Questions",
                    "prerequisites": [
                      "nlp_transformers_llm_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "nlp_transformers_llm_sub6",
                    "subskillName": "Transformers & LLM Fine-Tuning: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "nlp_transformers_llm_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mlops_fastapi_deploy",
                "skillName": "MLOps, Model Serving & FastAPI Deployment",
                "prerequisites": [
                  "nlp_transformers_llm"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mlops_fastapi_deploy_sub1",
                    "subskillName": "MLOps, Model Serving & FastAPI Deployment: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mlops_fastapi_deploy_sub2",
                    "subskillName": "MLOps, Model Serving & FastAPI Deployment: Component Structure & Memory",
                    "prerequisites": [
                      "mlops_fastapi_deploy_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mlops_fastapi_deploy_sub3",
                    "subskillName": "MLOps, Model Serving & FastAPI Deployment: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mlops_fastapi_deploy_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mlops_fastapi_deploy_sub4",
                    "subskillName": "MLOps, Model Serving & FastAPI Deployment: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mlops_fastapi_deploy_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mlops_fastapi_deploy_sub5",
                    "subskillName": "MLOps, Model Serving & FastAPI Deployment: Integration & Placement Questions",
                    "prerequisites": [
                      "mlops_fastapi_deploy_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mlops_fastapi_deploy_sub6",
                    "subskillName": "MLOps, Model Serving & FastAPI Deployment: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mlops_fastapi_deploy_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_pytorch_deep_learning",
                "skillName": "PyTorch Deep Learning & Custom Training Loops",
                "prerequisites": [
                  "dl_ann_backprop"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ds_pytorch_deep_learning_sub1",
                    "subskillName": "PyTorch Deep Learning & Custom Training Loops: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pytorch_deep_learning_sub2",
                    "subskillName": "PyTorch Deep Learning & Custom Training Loops: Component Structure & Memory",
                    "prerequisites": [
                      "ds_pytorch_deep_learning_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pytorch_deep_learning_sub3",
                    "subskillName": "PyTorch Deep Learning & Custom Training Loops: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_pytorch_deep_learning_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pytorch_deep_learning_sub4",
                    "subskillName": "PyTorch Deep Learning & Custom Training Loops: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_pytorch_deep_learning_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pytorch_deep_learning_sub5",
                    "subskillName": "PyTorch Deep Learning & Custom Training Loops: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_pytorch_deep_learning_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_pytorch_deep_learning_sub6",
                    "subskillName": "PyTorch Deep Learning & Custom Training Loops: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_pytorch_deep_learning_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_transformers_bert_huggingface",
                "skillName": "Hugging Face Transformers & BERT Architectures",
                "prerequisites": [
                  "nlp_transformers_llm"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ds_transformers_bert_huggingface_sub1",
                    "subskillName": "Hugging Face Transformers & BERT Architectures: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_transformers_bert_huggingface_sub2",
                    "subskillName": "Hugging Face Transformers & BERT Architectures: Component Structure & Memory",
                    "prerequisites": [
                      "ds_transformers_bert_huggingface_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_transformers_bert_huggingface_sub3",
                    "subskillName": "Hugging Face Transformers & BERT Architectures: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_transformers_bert_huggingface_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_transformers_bert_huggingface_sub4",
                    "subskillName": "Hugging Face Transformers & BERT Architectures: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_transformers_bert_huggingface_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_transformers_bert_huggingface_sub5",
                    "subskillName": "Hugging Face Transformers & BERT Architectures: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_transformers_bert_huggingface_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_transformers_bert_huggingface_sub6",
                    "subskillName": "Hugging Face Transformers & BERT Architectures: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_transformers_bert_huggingface_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "datascience_sub_advanced_3",
            "name": "MLflow Experiment Tracking & Core Concepts",
            "skills": [
              {
                "skillId": "ds_mlflow_tracking",
                "skillName": "MLflow Experiment Tracking & Registry Governance",
                "prerequisites": [
                  "mlops_fastapi_deploy"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ds_mlflow_tracking_sub1",
                    "subskillName": "MLflow Experiment Tracking & Registry Governance: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_mlflow_tracking_sub2",
                    "subskillName": "MLflow Experiment Tracking & Registry Governance: Component Structure & Memory",
                    "prerequisites": [
                      "ds_mlflow_tracking_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_mlflow_tracking_sub3",
                    "subskillName": "MLflow Experiment Tracking & Registry Governance: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_mlflow_tracking_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_mlflow_tracking_sub4",
                    "subskillName": "MLflow Experiment Tracking & Registry Governance: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_mlflow_tracking_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_mlflow_tracking_sub5",
                    "subskillName": "MLflow Experiment Tracking & Registry Governance: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_mlflow_tracking_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_mlflow_tracking_sub6",
                    "subskillName": "MLflow Experiment Tracking & Registry Governance: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_mlflow_tracking_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_distributed_spark",
                "skillName": "Distributed Data Engineering with PySpark",
                "prerequisites": [
                  "mlops_fastapi_deploy"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ds_distributed_spark_sub1",
                    "subskillName": "Distributed Data Engineering with PySpark: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_distributed_spark_sub2",
                    "subskillName": "Distributed Data Engineering with PySpark: Component Structure & Memory",
                    "prerequisites": [
                      "ds_distributed_spark_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_distributed_spark_sub3",
                    "subskillName": "Distributed Data Engineering with PySpark: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_distributed_spark_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_distributed_spark_sub4",
                    "subskillName": "Distributed Data Engineering with PySpark: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_distributed_spark_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_distributed_spark_sub5",
                    "subskillName": "Distributed Data Engineering with PySpark: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_distributed_spark_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_distributed_spark_sub6",
                    "subskillName": "Distributed Data Engineering with PySpark: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_distributed_spark_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_vector_search_rag",
                "skillName": "Vector Search, Embeddings & RAG for Data Science",
                "prerequisites": [
                  "nlp_transformers_llm"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ds_vector_search_rag_sub1",
                    "subskillName": "Vector Search, Embeddings & RAG for Data Science: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_vector_search_rag_sub2",
                    "subskillName": "Vector Search, Embeddings & RAG for Data Science: Component Structure & Memory",
                    "prerequisites": [
                      "ds_vector_search_rag_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_vector_search_rag_sub3",
                    "subskillName": "Vector Search, Embeddings & RAG for Data Science: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_vector_search_rag_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_vector_search_rag_sub4",
                    "subskillName": "Vector Search, Embeddings & RAG for Data Science: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_vector_search_rag_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_vector_search_rag_sub5",
                    "subskillName": "Vector Search, Embeddings & RAG for Data Science: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_vector_search_rag_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_vector_search_rag_sub6",
                    "subskillName": "Vector Search, Embeddings & RAG for Data Science: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_vector_search_rag_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ds_model_drift_monitoring",
                "skillName": "Concept Drift Detection & Continuous Model Monitoring",
                "prerequisites": [
                  "mlops_fastapi_deploy"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ds_model_drift_monitoring_sub1",
                    "subskillName": "Concept Drift Detection & Continuous Model Monitoring: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_model_drift_monitoring_sub2",
                    "subskillName": "Concept Drift Detection & Continuous Model Monitoring: Component Structure & Memory",
                    "prerequisites": [
                      "ds_model_drift_monitoring_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_model_drift_monitoring_sub3",
                    "subskillName": "Concept Drift Detection & Continuous Model Monitoring: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ds_model_drift_monitoring_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_model_drift_monitoring_sub4",
                    "subskillName": "Concept Drift Detection & Continuous Model Monitoring: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ds_model_drift_monitoring_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_model_drift_monitoring_sub5",
                    "subskillName": "Concept Drift Detection & Continuous Model Monitoring: Integration & Placement Questions",
                    "prerequisites": [
                      "ds_model_drift_monitoring_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ds_model_drift_monitoring_sub6",
                    "subskillName": "Concept Drift Detection & Continuous Model Monitoring: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ds_model_drift_monitoring_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "cybersecurity": {
    "domainId": "cybersecurity",
    "domainName": "Cybersecurity & Ethical Hacking",
    "topics": [
      {
        "id": "cybersecurity_top_beginner",
        "name": "Cybersecurity & Ethical Hacking — Beginner Tier",
        "subtopics": [
          {
            "id": "cybersecurity_sub_beginner_1",
            "name": "Linux Command Line & Core Concepts",
            "skills": [
              {
                "skillId": "sec_linux_cli",
                "skillName": "Linux Command Line & Systems Basics",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_linux_cli_sub1",
                    "subskillName": "Linux Command Line & Systems Basics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_linux_cli_sub2",
                    "subskillName": "Linux Command Line & Systems Basics: Component Structure & Memory",
                    "prerequisites": [
                      "sec_linux_cli_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_linux_cli_sub3",
                    "subskillName": "Linux Command Line & Systems Basics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_linux_cli_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_linux_cli_sub4",
                    "subskillName": "Linux Command Line & Systems Basics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_linux_cli_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_linux_cli_sub5",
                    "subskillName": "Linux Command Line & Systems Basics: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_linux_cli_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_linux_cli_sub6",
                    "subskillName": "Linux Command Line & Systems Basics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_linux_cli_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_win_cli",
                "skillName": "Windows CLI & File Privileges",
                "prerequisites": [
                  "sec_linux_cli"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_win_cli_sub1",
                    "subskillName": "Windows CLI & File Privileges: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_win_cli_sub2",
                    "subskillName": "Windows CLI & File Privileges: Component Structure & Memory",
                    "prerequisites": [
                      "sec_win_cli_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_win_cli_sub3",
                    "subskillName": "Windows CLI & File Privileges: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_win_cli_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_win_cli_sub4",
                    "subskillName": "Windows CLI & File Privileges: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_win_cli_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_win_cli_sub5",
                    "subskillName": "Windows CLI & File Privileges: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_win_cli_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_win_cli_sub6",
                    "subskillName": "Windows CLI & File Privileges: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_win_cli_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_net_tcpip",
                "skillName": "Computer Networking & TCP/IP Protocols",
                "prerequisites": [
                  "sec_linux_cli"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_net_tcpip_sub1",
                    "subskillName": "Computer Networking & TCP/IP Protocols: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_net_tcpip_sub2",
                    "subskillName": "Computer Networking & TCP/IP Protocols: Component Structure & Memory",
                    "prerequisites": [
                      "sec_net_tcpip_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_net_tcpip_sub3",
                    "subskillName": "Computer Networking & TCP/IP Protocols: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_net_tcpip_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_net_tcpip_sub4",
                    "subskillName": "Computer Networking & TCP/IP Protocols: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_net_tcpip_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_net_tcpip_sub5",
                    "subskillName": "Computer Networking & TCP/IP Protocols: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_net_tcpip_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_net_tcpip_sub6",
                    "subskillName": "Computer Networking & TCP/IP Protocols: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_net_tcpip_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_wireshark_capture",
                "skillName": "Wireshark Packet Inspection & Protocols",
                "prerequisites": [
                  "sec_net_tcpip"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_wireshark_capture_sub1",
                    "subskillName": "Wireshark Packet Inspection & Protocols: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_wireshark_capture_sub2",
                    "subskillName": "Wireshark Packet Inspection & Protocols: Component Structure & Memory",
                    "prerequisites": [
                      "sec_wireshark_capture_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_wireshark_capture_sub3",
                    "subskillName": "Wireshark Packet Inspection & Protocols: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_wireshark_capture_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_wireshark_capture_sub4",
                    "subskillName": "Wireshark Packet Inspection & Protocols: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_wireshark_capture_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_wireshark_capture_sub5",
                    "subskillName": "Wireshark Packet Inspection & Protocols: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_wireshark_capture_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_wireshark_capture_sub6",
                    "subskillName": "Wireshark Packet Inspection & Protocols: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_wireshark_capture_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "cybersecurity_sub_beginner_2",
            "name": "CIA Triad, Security Governance & Core Concepts",
            "skills": [
              {
                "skillId": "sec_cia_fundamentals",
                "skillName": "CIA Triad, Security Governance & Threat Modeling",
                "prerequisites": [
                  "sec_linux_cli"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_cia_fundamentals_sub1",
                    "subskillName": "CIA Triad, Security Governance & Threat Modeling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cia_fundamentals_sub2",
                    "subskillName": "CIA Triad, Security Governance & Threat Modeling: Component Structure & Memory",
                    "prerequisites": [
                      "sec_cia_fundamentals_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cia_fundamentals_sub3",
                    "subskillName": "CIA Triad, Security Governance & Threat Modeling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_cia_fundamentals_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cia_fundamentals_sub4",
                    "subskillName": "CIA Triad, Security Governance & Threat Modeling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_cia_fundamentals_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cia_fundamentals_sub5",
                    "subskillName": "CIA Triad, Security Governance & Threat Modeling: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_cia_fundamentals_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cia_fundamentals_sub6",
                    "subskillName": "CIA Triad, Security Governance & Threat Modeling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_cia_fundamentals_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_dns_dhcp_security",
                "skillName": "DNS, DHCP & Core Network Protocol Hardening",
                "prerequisites": [
                  "sec_net_tcpip"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_dns_dhcp_security_sub1",
                    "subskillName": "DNS, DHCP & Core Network Protocol Hardening: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_dns_dhcp_security_sub2",
                    "subskillName": "DNS, DHCP & Core Network Protocol Hardening: Component Structure & Memory",
                    "prerequisites": [
                      "sec_dns_dhcp_security_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_dns_dhcp_security_sub3",
                    "subskillName": "DNS, DHCP & Core Network Protocol Hardening: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_dns_dhcp_security_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_dns_dhcp_security_sub4",
                    "subskillName": "DNS, DHCP & Core Network Protocol Hardening: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_dns_dhcp_security_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_dns_dhcp_security_sub5",
                    "subskillName": "DNS, DHCP & Core Network Protocol Hardening: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_dns_dhcp_security_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_dns_dhcp_security_sub6",
                    "subskillName": "DNS, DHCP & Core Network Protocol Hardening: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_dns_dhcp_security_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_ports_protocols",
                "skillName": "Port Protocols, Service Enumeration & Banner Grabbing",
                "prerequisites": [
                  "sec_net_tcpip"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_ports_protocols_sub1",
                    "subskillName": "Port Protocols, Service Enumeration & Banner Grabbing: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_ports_protocols_sub2",
                    "subskillName": "Port Protocols, Service Enumeration & Banner Grabbing: Component Structure & Memory",
                    "prerequisites": [
                      "sec_ports_protocols_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_ports_protocols_sub3",
                    "subskillName": "Port Protocols, Service Enumeration & Banner Grabbing: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_ports_protocols_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_ports_protocols_sub4",
                    "subskillName": "Port Protocols, Service Enumeration & Banner Grabbing: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_ports_protocols_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_ports_protocols_sub5",
                    "subskillName": "Port Protocols, Service Enumeration & Banner Grabbing: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_ports_protocols_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_ports_protocols_sub6",
                    "subskillName": "Port Protocols, Service Enumeration & Banner Grabbing: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_ports_protocols_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_crypto_foundations",
                "skillName": "Symmetric & Asymmetric Cryptography Basics",
                "prerequisites": [
                  "sec_linux_cli"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_crypto_foundations_sub1",
                    "subskillName": "Symmetric & Asymmetric Cryptography Basics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_foundations_sub2",
                    "subskillName": "Symmetric & Asymmetric Cryptography Basics: Component Structure & Memory",
                    "prerequisites": [
                      "sec_crypto_foundations_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_foundations_sub3",
                    "subskillName": "Symmetric & Asymmetric Cryptography Basics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_crypto_foundations_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_foundations_sub4",
                    "subskillName": "Symmetric & Asymmetric Cryptography Basics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_crypto_foundations_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_foundations_sub5",
                    "subskillName": "Symmetric & Asymmetric Cryptography Basics: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_crypto_foundations_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_foundations_sub6",
                    "subskillName": "Symmetric & Asymmetric Cryptography Basics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_crypto_foundations_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "cybersecurity_sub_beginner_3",
            "name": "Password Storage Security, Salting & Core Concepts",
            "skills": [
              {
                "skillId": "sec_password_hashing",
                "skillName": "Password Storage Security, Salting & PBKDF2",
                "prerequisites": [
                  "sec_crypto_foundations"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_password_hashing_sub1",
                    "subskillName": "Password Storage Security, Salting & PBKDF2: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_password_hashing_sub2",
                    "subskillName": "Password Storage Security, Salting & PBKDF2: Component Structure & Memory",
                    "prerequisites": [
                      "sec_password_hashing_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_password_hashing_sub3",
                    "subskillName": "Password Storage Security, Salting & PBKDF2: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_password_hashing_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_password_hashing_sub4",
                    "subskillName": "Password Storage Security, Salting & PBKDF2: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_password_hashing_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_password_hashing_sub5",
                    "subskillName": "Password Storage Security, Salting & PBKDF2: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_password_hashing_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_password_hashing_sub6",
                    "subskillName": "Password Storage Security, Salting & PBKDF2: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_password_hashing_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_os_permissions",
                "skillName": "Linux & Windows Permissions, SUID & Access Control",
                "prerequisites": [
                  "sec_win_cli"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_os_permissions_sub1",
                    "subskillName": "Linux & Windows Permissions, SUID & Access Control: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_os_permissions_sub2",
                    "subskillName": "Linux & Windows Permissions, SUID & Access Control: Component Structure & Memory",
                    "prerequisites": [
                      "sec_os_permissions_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_os_permissions_sub3",
                    "subskillName": "Linux & Windows Permissions, SUID & Access Control: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_os_permissions_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_os_permissions_sub4",
                    "subskillName": "Linux & Windows Permissions, SUID & Access Control: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_os_permissions_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_os_permissions_sub5",
                    "subskillName": "Linux & Windows Permissions, SUID & Access Control: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_os_permissions_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_os_permissions_sub6",
                    "subskillName": "Linux & Windows Permissions, SUID & Access Control: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_os_permissions_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_browser_security",
                "skillName": "Web Security Foundations & Same-Origin Policy",
                "prerequisites": [
                  "sec_net_tcpip"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_browser_security_sub1",
                    "subskillName": "Web Security Foundations & Same-Origin Policy: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_browser_security_sub2",
                    "subskillName": "Web Security Foundations & Same-Origin Policy: Component Structure & Memory",
                    "prerequisites": [
                      "sec_browser_security_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_browser_security_sub3",
                    "subskillName": "Web Security Foundations & Same-Origin Policy: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_browser_security_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_browser_security_sub4",
                    "subskillName": "Web Security Foundations & Same-Origin Policy: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_browser_security_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_browser_security_sub5",
                    "subskillName": "Web Security Foundations & Same-Origin Policy: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_browser_security_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_browser_security_sub6",
                    "subskillName": "Web Security Foundations & Same-Origin Policy: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_browser_security_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_reconnaissance_osint",
                "skillName": "Open-Source Intelligence (OSINT) & Digital Footprinting",
                "prerequisites": [
                  "sec_linux_cli"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sec_reconnaissance_osint_sub1",
                    "subskillName": "Open-Source Intelligence (OSINT) & Digital Footprinting: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reconnaissance_osint_sub2",
                    "subskillName": "Open-Source Intelligence (OSINT) & Digital Footprinting: Component Structure & Memory",
                    "prerequisites": [
                      "sec_reconnaissance_osint_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reconnaissance_osint_sub3",
                    "subskillName": "Open-Source Intelligence (OSINT) & Digital Footprinting: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_reconnaissance_osint_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reconnaissance_osint_sub4",
                    "subskillName": "Open-Source Intelligence (OSINT) & Digital Footprinting: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_reconnaissance_osint_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reconnaissance_osint_sub5",
                    "subskillName": "Open-Source Intelligence (OSINT) & Digital Footprinting: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_reconnaissance_osint_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reconnaissance_osint_sub6",
                    "subskillName": "Open-Source Intelligence (OSINT) & Digital Footprinting: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_reconnaissance_osint_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cybersecurity_top_intermediate",
        "name": "Cybersecurity & Ethical Hacking — Intermediate Tier",
        "subtopics": [
          {
            "id": "cybersecurity_sub_intermediate_1",
            "name": "Firewalls, IDS/IPS & Core Concepts",
            "skills": [
              {
                "skillId": "sec_firewalls_ids",
                "skillName": "Firewalls, IDS/IPS & Rule Sets",
                "prerequisites": [
                  "sec_net_tcpip"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_firewalls_ids_sub1",
                    "subskillName": "Firewalls, IDS/IPS & Rule Sets: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_firewalls_ids_sub2",
                    "subskillName": "Firewalls, IDS/IPS & Rule Sets: Component Structure & Memory",
                    "prerequisites": [
                      "sec_firewalls_ids_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_firewalls_ids_sub3",
                    "subskillName": "Firewalls, IDS/IPS & Rule Sets: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_firewalls_ids_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_firewalls_ids_sub4",
                    "subskillName": "Firewalls, IDS/IPS & Rule Sets: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_firewalls_ids_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_firewalls_ids_sub5",
                    "subskillName": "Firewalls, IDS/IPS & Rule Sets: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_firewalls_ids_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_firewalls_ids_sub6",
                    "subskillName": "Firewalls, IDS/IPS & Rule Sets: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_firewalls_ids_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_vpn_nmap",
                "skillName": "Nmap Scanning & VPN Tunneling",
                "prerequisites": [
                  "sec_firewalls_ids"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_vpn_nmap_sub1",
                    "subskillName": "Nmap Scanning & VPN Tunneling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vpn_nmap_sub2",
                    "subskillName": "Nmap Scanning & VPN Tunneling: Component Structure & Memory",
                    "prerequisites": [
                      "sec_vpn_nmap_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vpn_nmap_sub3",
                    "subskillName": "Nmap Scanning & VPN Tunneling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_vpn_nmap_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vpn_nmap_sub4",
                    "subskillName": "Nmap Scanning & VPN Tunneling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_vpn_nmap_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vpn_nmap_sub5",
                    "subskillName": "Nmap Scanning & VPN Tunneling: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_vpn_nmap_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vpn_nmap_sub6",
                    "subskillName": "Nmap Scanning & VPN Tunneling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_vpn_nmap_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_owasp_xss",
                "skillName": "Cross-Site Scripting (XSS) & Defenses",
                "prerequisites": [
                  "sec_vpn_nmap"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_owasp_xss_sub1",
                    "subskillName": "Cross-Site Scripting (XSS) & Defenses: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_owasp_xss_sub2",
                    "subskillName": "Cross-Site Scripting (XSS) & Defenses: Component Structure & Memory",
                    "prerequisites": [
                      "sec_owasp_xss_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_owasp_xss_sub3",
                    "subskillName": "Cross-Site Scripting (XSS) & Defenses: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_owasp_xss_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_owasp_xss_sub4",
                    "subskillName": "Cross-Site Scripting (XSS) & Defenses: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_owasp_xss_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_owasp_xss_sub5",
                    "subskillName": "Cross-Site Scripting (XSS) & Defenses: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_owasp_xss_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_owasp_xss_sub6",
                    "subskillName": "Cross-Site Scripting (XSS) & Defenses: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_owasp_xss_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_sqli_csrf",
                "skillName": "SQL Injection & CSRF Attacks",
                "prerequisites": [
                  "sec_owasp_xss"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_sqli_csrf_sub1",
                    "subskillName": "SQL Injection & CSRF Attacks: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sqli_csrf_sub2",
                    "subskillName": "SQL Injection & CSRF Attacks: Component Structure & Memory",
                    "prerequisites": [
                      "sec_sqli_csrf_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sqli_csrf_sub3",
                    "subskillName": "SQL Injection & CSRF Attacks: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_sqli_csrf_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sqli_csrf_sub4",
                    "subskillName": "SQL Injection & CSRF Attacks: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_sqli_csrf_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sqli_csrf_sub5",
                    "subskillName": "SQL Injection & CSRF Attacks: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_sqli_csrf_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sqli_csrf_sub6",
                    "subskillName": "SQL Injection & CSRF Attacks: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_sqli_csrf_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "cybersecurity_sub_intermediate_2",
            "name": "Symmetric & Core Concepts",
            "skills": [
              {
                "skillId": "sec_crypto_ciphers",
                "skillName": "Symmetric & Asymmetric Encryption",
                "prerequisites": [
                  "sec_sqli_csrf"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_crypto_ciphers_sub1",
                    "subskillName": "Symmetric & Asymmetric Encryption: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_ciphers_sub2",
                    "subskillName": "Symmetric & Asymmetric Encryption: Component Structure & Memory",
                    "prerequisites": [
                      "sec_crypto_ciphers_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_ciphers_sub3",
                    "subskillName": "Symmetric & Asymmetric Encryption: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_crypto_ciphers_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_ciphers_sub4",
                    "subskillName": "Symmetric & Asymmetric Encryption: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_crypto_ciphers_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_ciphers_sub5",
                    "subskillName": "Symmetric & Asymmetric Encryption: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_crypto_ciphers_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_crypto_ciphers_sub6",
                    "subskillName": "Symmetric & Asymmetric Encryption: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_crypto_ciphers_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_vulnerability_scanning",
                "skillName": "Automated Vulnerability Scanning with Nessus & OpenVAS",
                "prerequisites": [
                  "sec_vpn_nmap"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_vulnerability_scanning_sub1",
                    "subskillName": "Automated Vulnerability Scanning with Nessus & OpenVAS: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vulnerability_scanning_sub2",
                    "subskillName": "Automated Vulnerability Scanning with Nessus & OpenVAS: Component Structure & Memory",
                    "prerequisites": [
                      "sec_vulnerability_scanning_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vulnerability_scanning_sub3",
                    "subskillName": "Automated Vulnerability Scanning with Nessus & OpenVAS: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_vulnerability_scanning_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vulnerability_scanning_sub4",
                    "subskillName": "Automated Vulnerability Scanning with Nessus & OpenVAS: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_vulnerability_scanning_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vulnerability_scanning_sub5",
                    "subskillName": "Automated Vulnerability Scanning with Nessus & OpenVAS: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_vulnerability_scanning_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_vulnerability_scanning_sub6",
                    "subskillName": "Automated Vulnerability Scanning with Nessus & OpenVAS: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_vulnerability_scanning_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_burp_suite_web",
                "skillName": "Burp Suite Web Proxying & Request Tampering",
                "prerequisites": [
                  "sec_owasp_xss"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_burp_suite_web_sub1",
                    "subskillName": "Burp Suite Web Proxying & Request Tampering: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_burp_suite_web_sub2",
                    "subskillName": "Burp Suite Web Proxying & Request Tampering: Component Structure & Memory",
                    "prerequisites": [
                      "sec_burp_suite_web_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_burp_suite_web_sub3",
                    "subskillName": "Burp Suite Web Proxying & Request Tampering: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_burp_suite_web_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_burp_suite_web_sub4",
                    "subskillName": "Burp Suite Web Proxying & Request Tampering: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_burp_suite_web_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_burp_suite_web_sub5",
                    "subskillName": "Burp Suite Web Proxying & Request Tampering: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_burp_suite_web_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_burp_suite_web_sub6",
                    "subskillName": "Burp Suite Web Proxying & Request Tampering: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_burp_suite_web_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_soc_log_analysis",
                "skillName": "SOC Operations, Syslog Analysis & Event Correlation",
                "prerequisites": [
                  "sec_firewalls_ids"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_soc_log_analysis_sub1",
                    "subskillName": "SOC Operations, Syslog Analysis & Event Correlation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_soc_log_analysis_sub2",
                    "subskillName": "SOC Operations, Syslog Analysis & Event Correlation: Component Structure & Memory",
                    "prerequisites": [
                      "sec_soc_log_analysis_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_soc_log_analysis_sub3",
                    "subskillName": "SOC Operations, Syslog Analysis & Event Correlation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_soc_log_analysis_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_soc_log_analysis_sub4",
                    "subskillName": "SOC Operations, Syslog Analysis & Event Correlation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_soc_log_analysis_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_soc_log_analysis_sub5",
                    "subskillName": "SOC Operations, Syslog Analysis & Event Correlation: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_soc_log_analysis_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_soc_log_analysis_sub6",
                    "subskillName": "SOC Operations, Syslog Analysis & Event Correlation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_soc_log_analysis_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "cybersecurity_sub_intermediate_3",
            "name": "Incident Response Lifecycles, Triage & Core Concepts",
            "skills": [
              {
                "skillId": "sec_incident_response_handling",
                "skillName": "Incident Response Lifecycles, Triage & Containment",
                "prerequisites": [
                  "sec_soc_log_analysis"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_incident_response_handling_sub1",
                    "subskillName": "Incident Response Lifecycles, Triage & Containment: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_incident_response_handling_sub2",
                    "subskillName": "Incident Response Lifecycles, Triage & Containment: Component Structure & Memory",
                    "prerequisites": [
                      "sec_incident_response_handling_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_incident_response_handling_sub3",
                    "subskillName": "Incident Response Lifecycles, Triage & Containment: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_incident_response_handling_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_incident_response_handling_sub4",
                    "subskillName": "Incident Response Lifecycles, Triage & Containment: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_incident_response_handling_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_incident_response_handling_sub5",
                    "subskillName": "Incident Response Lifecycles, Triage & Containment: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_incident_response_handling_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_incident_response_handling_sub6",
                    "subskillName": "Incident Response Lifecycles, Triage & Containment: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_incident_response_handling_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_endpoint_edr",
                "skillName": "Endpoint Detection & Response (EDR) Architecture",
                "prerequisites": [
                  "sec_firewalls_ids"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_endpoint_edr_sub1",
                    "subskillName": "Endpoint Detection & Response (EDR) Architecture: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_endpoint_edr_sub2",
                    "subskillName": "Endpoint Detection & Response (EDR) Architecture: Component Structure & Memory",
                    "prerequisites": [
                      "sec_endpoint_edr_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_endpoint_edr_sub3",
                    "subskillName": "Endpoint Detection & Response (EDR) Architecture: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_endpoint_edr_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_endpoint_edr_sub4",
                    "subskillName": "Endpoint Detection & Response (EDR) Architecture: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_endpoint_edr_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_endpoint_edr_sub5",
                    "subskillName": "Endpoint Detection & Response (EDR) Architecture: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_endpoint_edr_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_endpoint_edr_sub6",
                    "subskillName": "Endpoint Detection & Response (EDR) Architecture: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_endpoint_edr_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_malware_analysis_basics",
                "skillName": "Static & Dynamic Malware Analysis in Sandboxes",
                "prerequisites": [
                  "sec_vpn_nmap"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_malware_analysis_basics_sub1",
                    "subskillName": "Static & Dynamic Malware Analysis in Sandboxes: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_malware_analysis_basics_sub2",
                    "subskillName": "Static & Dynamic Malware Analysis in Sandboxes: Component Structure & Memory",
                    "prerequisites": [
                      "sec_malware_analysis_basics_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_malware_analysis_basics_sub3",
                    "subskillName": "Static & Dynamic Malware Analysis in Sandboxes: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_malware_analysis_basics_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_malware_analysis_basics_sub4",
                    "subskillName": "Static & Dynamic Malware Analysis in Sandboxes: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_malware_analysis_basics_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_malware_analysis_basics_sub5",
                    "subskillName": "Static & Dynamic Malware Analysis in Sandboxes: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_malware_analysis_basics_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_malware_analysis_basics_sub6",
                    "subskillName": "Static & Dynamic Malware Analysis in Sandboxes: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_malware_analysis_basics_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_iam_oauth_saml",
                "skillName": "Identity & Access Management, OAuth 2.0 & SAML",
                "prerequisites": [
                  "sec_crypto_ciphers"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sec_iam_oauth_saml_sub1",
                    "subskillName": "Identity & Access Management, OAuth 2.0 & SAML: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_iam_oauth_saml_sub2",
                    "subskillName": "Identity & Access Management, OAuth 2.0 & SAML: Component Structure & Memory",
                    "prerequisites": [
                      "sec_iam_oauth_saml_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_iam_oauth_saml_sub3",
                    "subskillName": "Identity & Access Management, OAuth 2.0 & SAML: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_iam_oauth_saml_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_iam_oauth_saml_sub4",
                    "subskillName": "Identity & Access Management, OAuth 2.0 & SAML: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_iam_oauth_saml_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_iam_oauth_saml_sub5",
                    "subskillName": "Identity & Access Management, OAuth 2.0 & SAML: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_iam_oauth_saml_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_iam_oauth_saml_sub6",
                    "subskillName": "Identity & Access Management, OAuth 2.0 & SAML: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_iam_oauth_saml_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "cybersecurity_top_advanced",
        "name": "Cybersecurity & Ethical Hacking — Advanced Tier",
        "subtopics": [
          {
            "id": "cybersecurity_sub_advanced_1",
            "name": "PKI Certificates & Core Concepts",
            "skills": [
              {
                "skillId": "sec_pki_tls",
                "skillName": "PKI Certificates & TLS Handshake",
                "prerequisites": [
                  "sec_crypto_ciphers"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_pki_tls_sub1",
                    "subskillName": "PKI Certificates & TLS Handshake: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_pki_tls_sub2",
                    "subskillName": "PKI Certificates & TLS Handshake: Component Structure & Memory",
                    "prerequisites": [
                      "sec_pki_tls_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_pki_tls_sub3",
                    "subskillName": "PKI Certificates & TLS Handshake: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_pki_tls_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_pki_tls_sub4",
                    "subskillName": "PKI Certificates & TLS Handshake: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_pki_tls_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_pki_tls_sub5",
                    "subskillName": "PKI Certificates & TLS Handshake: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_pki_tls_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_pki_tls_sub6",
                    "subskillName": "PKI Certificates & TLS Handshake: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_pki_tls_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_sys_hardening",
                "skillName": "Linux/Windows OS Security Hardening",
                "prerequisites": [
                  "sec_pki_tls"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_sys_hardening_sub1",
                    "subskillName": "Linux/Windows OS Security Hardening: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sys_hardening_sub2",
                    "subskillName": "Linux/Windows OS Security Hardening: Component Structure & Memory",
                    "prerequisites": [
                      "sec_sys_hardening_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sys_hardening_sub3",
                    "subskillName": "Linux/Windows OS Security Hardening: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_sys_hardening_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sys_hardening_sub4",
                    "subskillName": "Linux/Windows OS Security Hardening: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_sys_hardening_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sys_hardening_sub5",
                    "subskillName": "Linux/Windows OS Security Hardening: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_sys_hardening_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_sys_hardening_sub6",
                    "subskillName": "Linux/Windows OS Security Hardening: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_sys_hardening_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_priv_esc",
                "skillName": "Active Directory & Privilege Escalation",
                "prerequisites": [
                  "sec_sys_hardening"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_priv_esc_sub1",
                    "subskillName": "Active Directory & Privilege Escalation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_priv_esc_sub2",
                    "subskillName": "Active Directory & Privilege Escalation: Component Structure & Memory",
                    "prerequisites": [
                      "sec_priv_esc_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_priv_esc_sub3",
                    "subskillName": "Active Directory & Privilege Escalation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_priv_esc_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_priv_esc_sub4",
                    "subskillName": "Active Directory & Privilege Escalation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_priv_esc_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_priv_esc_sub5",
                    "subskillName": "Active Directory & Privilege Escalation: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_priv_esc_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_priv_esc_sub6",
                    "subskillName": "Active Directory & Privilege Escalation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_priv_esc_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_siem_splunk",
                "skillName": "SIEM Log Analysis & Splunk Queries",
                "prerequisites": [
                  "sec_priv_esc"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_siem_splunk_sub1",
                    "subskillName": "SIEM Log Analysis & Splunk Queries: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_siem_splunk_sub2",
                    "subskillName": "SIEM Log Analysis & Splunk Queries: Component Structure & Memory",
                    "prerequisites": [
                      "sec_siem_splunk_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_siem_splunk_sub3",
                    "subskillName": "SIEM Log Analysis & Splunk Queries: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_siem_splunk_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_siem_splunk_sub4",
                    "subskillName": "SIEM Log Analysis & Splunk Queries: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_siem_splunk_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_siem_splunk_sub5",
                    "subskillName": "SIEM Log Analysis & Splunk Queries: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_siem_splunk_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_siem_splunk_sub6",
                    "subskillName": "SIEM Log Analysis & Splunk Queries: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_siem_splunk_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "cybersecurity_sub_advanced_2",
            "name": "Memory Forensics & Core Concepts",
            "skills": [
              {
                "skillId": "sec_forensics_capstone",
                "skillName": "Memory Forensics & Incident Response Capstone",
                "prerequisites": [
                  "sec_siem_splunk"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_forensics_capstone_sub1",
                    "subskillName": "Memory Forensics & Incident Response Capstone: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_forensics_capstone_sub2",
                    "subskillName": "Memory Forensics & Incident Response Capstone: Component Structure & Memory",
                    "prerequisites": [
                      "sec_forensics_capstone_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_forensics_capstone_sub3",
                    "subskillName": "Memory Forensics & Incident Response Capstone: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_forensics_capstone_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_forensics_capstone_sub4",
                    "subskillName": "Memory Forensics & Incident Response Capstone: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_forensics_capstone_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_forensics_capstone_sub5",
                    "subskillName": "Memory Forensics & Incident Response Capstone: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_forensics_capstone_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_forensics_capstone_sub6",
                    "subskillName": "Memory Forensics & Incident Response Capstone: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_forensics_capstone_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_active_directory_attacks",
                "skillName": "Kerberoasting, Pass-the-Hash & BloodHound Mapping",
                "prerequisites": [
                  "sec_priv_esc"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_active_directory_attacks_sub1",
                    "subskillName": "Kerberoasting, Pass-the-Hash & BloodHound Mapping: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_active_directory_attacks_sub2",
                    "subskillName": "Kerberoasting, Pass-the-Hash & BloodHound Mapping: Component Structure & Memory",
                    "prerequisites": [
                      "sec_active_directory_attacks_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_active_directory_attacks_sub3",
                    "subskillName": "Kerberoasting, Pass-the-Hash & BloodHound Mapping: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_active_directory_attacks_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_active_directory_attacks_sub4",
                    "subskillName": "Kerberoasting, Pass-the-Hash & BloodHound Mapping: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_active_directory_attacks_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_active_directory_attacks_sub5",
                    "subskillName": "Kerberoasting, Pass-the-Hash & BloodHound Mapping: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_active_directory_attacks_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_active_directory_attacks_sub6",
                    "subskillName": "Kerberoasting, Pass-the-Hash & BloodHound Mapping: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_active_directory_attacks_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_metasploit_exploitation",
                "skillName": "Penetration Testing with Metasploit Framework",
                "prerequisites": [
                  "sec_priv_esc"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_metasploit_exploitation_sub1",
                    "subskillName": "Penetration Testing with Metasploit Framework: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_metasploit_exploitation_sub2",
                    "subskillName": "Penetration Testing with Metasploit Framework: Component Structure & Memory",
                    "prerequisites": [
                      "sec_metasploit_exploitation_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_metasploit_exploitation_sub3",
                    "subskillName": "Penetration Testing with Metasploit Framework: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_metasploit_exploitation_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_metasploit_exploitation_sub4",
                    "subskillName": "Penetration Testing with Metasploit Framework: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_metasploit_exploitation_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_metasploit_exploitation_sub5",
                    "subskillName": "Penetration Testing with Metasploit Framework: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_metasploit_exploitation_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_metasploit_exploitation_sub6",
                    "subskillName": "Penetration Testing with Metasploit Framework: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_metasploit_exploitation_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_buffer_overflow_exploit",
                "skillName": "Buffer Overflows, Memory Corruption & Shellcoding",
                "prerequisites": [
                  "sec_sys_hardening"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_buffer_overflow_exploit_sub1",
                    "subskillName": "Buffer Overflows, Memory Corruption & Shellcoding: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_buffer_overflow_exploit_sub2",
                    "subskillName": "Buffer Overflows, Memory Corruption & Shellcoding: Component Structure & Memory",
                    "prerequisites": [
                      "sec_buffer_overflow_exploit_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_buffer_overflow_exploit_sub3",
                    "subskillName": "Buffer Overflows, Memory Corruption & Shellcoding: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_buffer_overflow_exploit_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_buffer_overflow_exploit_sub4",
                    "subskillName": "Buffer Overflows, Memory Corruption & Shellcoding: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_buffer_overflow_exploit_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_buffer_overflow_exploit_sub5",
                    "subskillName": "Buffer Overflows, Memory Corruption & Shellcoding: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_buffer_overflow_exploit_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_buffer_overflow_exploit_sub6",
                    "subskillName": "Buffer Overflows, Memory Corruption & Shellcoding: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_buffer_overflow_exploit_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "cybersecurity_sub_advanced_3",
            "name": "AWS & Core Concepts",
            "skills": [
              {
                "skillId": "sec_cloud_sec_aws_azure",
                "skillName": "AWS & Azure Cloud Security & IAM Role Hardening",
                "prerequisites": [
                  "sec_sys_hardening"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_cloud_sec_aws_azure_sub1",
                    "subskillName": "AWS & Azure Cloud Security & IAM Role Hardening: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cloud_sec_aws_azure_sub2",
                    "subskillName": "AWS & Azure Cloud Security & IAM Role Hardening: Component Structure & Memory",
                    "prerequisites": [
                      "sec_cloud_sec_aws_azure_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cloud_sec_aws_azure_sub3",
                    "subskillName": "AWS & Azure Cloud Security & IAM Role Hardening: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_cloud_sec_aws_azure_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cloud_sec_aws_azure_sub4",
                    "subskillName": "AWS & Azure Cloud Security & IAM Role Hardening: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_cloud_sec_aws_azure_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cloud_sec_aws_azure_sub5",
                    "subskillName": "AWS & Azure Cloud Security & IAM Role Hardening: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_cloud_sec_aws_azure_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_cloud_sec_aws_azure_sub6",
                    "subskillName": "AWS & Azure Cloud Security & IAM Role Hardening: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_cloud_sec_aws_azure_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_reverse_engineering_ghidra",
                "skillName": "Reverse Engineering with Ghidra & Disassembly",
                "prerequisites": [
                  "sec_forensics_capstone"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_reverse_engineering_ghidra_sub1",
                    "subskillName": "Reverse Engineering with Ghidra & Disassembly: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reverse_engineering_ghidra_sub2",
                    "subskillName": "Reverse Engineering with Ghidra & Disassembly: Component Structure & Memory",
                    "prerequisites": [
                      "sec_reverse_engineering_ghidra_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reverse_engineering_ghidra_sub3",
                    "subskillName": "Reverse Engineering with Ghidra & Disassembly: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_reverse_engineering_ghidra_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reverse_engineering_ghidra_sub4",
                    "subskillName": "Reverse Engineering with Ghidra & Disassembly: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_reverse_engineering_ghidra_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reverse_engineering_ghidra_sub5",
                    "subskillName": "Reverse Engineering with Ghidra & Disassembly: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_reverse_engineering_ghidra_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_reverse_engineering_ghidra_sub6",
                    "subskillName": "Reverse Engineering with Ghidra & Disassembly: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_reverse_engineering_ghidra_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_threat_hunting_yara",
                "skillName": "Threat Hunting, YARA Signatures & MITRE ATT&CK",
                "prerequisites": [
                  "sec_siem_splunk"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_threat_hunting_yara_sub1",
                    "subskillName": "Threat Hunting, YARA Signatures & MITRE ATT&CK: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_threat_hunting_yara_sub2",
                    "subskillName": "Threat Hunting, YARA Signatures & MITRE ATT&CK: Component Structure & Memory",
                    "prerequisites": [
                      "sec_threat_hunting_yara_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_threat_hunting_yara_sub3",
                    "subskillName": "Threat Hunting, YARA Signatures & MITRE ATT&CK: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_threat_hunting_yara_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_threat_hunting_yara_sub4",
                    "subskillName": "Threat Hunting, YARA Signatures & MITRE ATT&CK: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_threat_hunting_yara_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_threat_hunting_yara_sub5",
                    "subskillName": "Threat Hunting, YARA Signatures & MITRE ATT&CK: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_threat_hunting_yara_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_threat_hunting_yara_sub6",
                    "subskillName": "Threat Hunting, YARA Signatures & MITRE ATT&CK: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_threat_hunting_yara_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sec_zero_trust_architecture",
                "skillName": "Zero Trust Network Architecture & Microsegmentation",
                "prerequisites": [
                  "sec_sys_hardening"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sec_zero_trust_architecture_sub1",
                    "subskillName": "Zero Trust Network Architecture & Microsegmentation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_zero_trust_architecture_sub2",
                    "subskillName": "Zero Trust Network Architecture & Microsegmentation: Component Structure & Memory",
                    "prerequisites": [
                      "sec_zero_trust_architecture_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_zero_trust_architecture_sub3",
                    "subskillName": "Zero Trust Network Architecture & Microsegmentation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sec_zero_trust_architecture_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_zero_trust_architecture_sub4",
                    "subskillName": "Zero Trust Network Architecture & Microsegmentation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sec_zero_trust_architecture_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_zero_trust_architecture_sub5",
                    "subskillName": "Zero Trust Network Architecture & Microsegmentation: Integration & Placement Questions",
                    "prerequisites": [
                      "sec_zero_trust_architecture_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sec_zero_trust_architecture_sub6",
                    "subskillName": "Zero Trust Network Architecture & Microsegmentation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sec_zero_trust_architecture_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "devops": {
    "domainId": "devops",
    "domainName": "Cloud Engineering & DevOps",
    "topics": [
      {
        "id": "devops_top_beginner",
        "name": "Cloud Engineering & DevOps — Beginner Tier",
        "subtopics": [
          {
            "id": "devops_sub_beginner_1",
            "name": "OS Architecture & Core Concepts",
            "skills": [
              {
                "skillId": "dev_os_net_basics",
                "skillName": "OS Architecture & Networking Protocols",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_os_net_basics_sub1",
                    "subskillName": "OS Architecture & Networking Protocols: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_os_net_basics_sub2",
                    "subskillName": "OS Architecture & Networking Protocols: Component Structure & Memory",
                    "prerequisites": [
                      "dev_os_net_basics_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_os_net_basics_sub3",
                    "subskillName": "OS Architecture & Networking Protocols: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_os_net_basics_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_os_net_basics_sub4",
                    "subskillName": "OS Architecture & Networking Protocols: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_os_net_basics_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_os_net_basics_sub5",
                    "subskillName": "OS Architecture & Networking Protocols: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_os_net_basics_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_os_net_basics_sub6",
                    "subskillName": "OS Architecture & Networking Protocols: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_os_net_basics_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_linux_files",
                "skillName": "Linux File System & Permissions",
                "prerequisites": [
                  "dev_os_net_basics"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_linux_files_sub1",
                    "subskillName": "Linux File System & Permissions: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_linux_files_sub2",
                    "subskillName": "Linux File System & Permissions: Component Structure & Memory",
                    "prerequisites": [
                      "dev_linux_files_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_linux_files_sub3",
                    "subskillName": "Linux File System & Permissions: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_linux_files_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_linux_files_sub4",
                    "subskillName": "Linux File System & Permissions: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_linux_files_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_linux_files_sub5",
                    "subskillName": "Linux File System & Permissions: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_linux_files_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_linux_files_sub6",
                    "subskillName": "Linux File System & Permissions: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_linux_files_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_systemd_services",
                "skillName": "Systemd Service Configuration & Process Mgmt",
                "prerequisites": [
                  "dev_linux_files"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_systemd_services_sub1",
                    "subskillName": "Systemd Service Configuration & Process Mgmt: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_systemd_services_sub2",
                    "subskillName": "Systemd Service Configuration & Process Mgmt: Component Structure & Memory",
                    "prerequisites": [
                      "dev_systemd_services_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_systemd_services_sub3",
                    "subskillName": "Systemd Service Configuration & Process Mgmt: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_systemd_services_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_systemd_services_sub4",
                    "subskillName": "Systemd Service Configuration & Process Mgmt: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_systemd_services_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_systemd_services_sub5",
                    "subskillName": "Systemd Service Configuration & Process Mgmt: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_systemd_services_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_systemd_services_sub6",
                    "subskillName": "Systemd Service Configuration & Process Mgmt: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_systemd_services_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_shell_scripting",
                "skillName": "Bash Shell Scripting & Automation",
                "prerequisites": [
                  "dev_systemd_services"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_shell_scripting_sub1",
                    "subskillName": "Bash Shell Scripting & Automation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_shell_scripting_sub2",
                    "subskillName": "Bash Shell Scripting & Automation: Component Structure & Memory",
                    "prerequisites": [
                      "dev_shell_scripting_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_shell_scripting_sub3",
                    "subskillName": "Bash Shell Scripting & Automation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_shell_scripting_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_shell_scripting_sub4",
                    "subskillName": "Bash Shell Scripting & Automation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_shell_scripting_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_shell_scripting_sub5",
                    "subskillName": "Bash Shell Scripting & Automation: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_shell_scripting_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_shell_scripting_sub6",
                    "subskillName": "Bash Shell Scripting & Automation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_shell_scripting_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "devops_sub_beginner_2",
            "name": "Git Version Control & Core Concepts",
            "skills": [
              {
                "skillId": "dev_git_fundamentals",
                "skillName": "Git Version Control & Repository Collaboration",
                "prerequisites": [
                  "dev_os_net_basics"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_git_fundamentals_sub1",
                    "subskillName": "Git Version Control & Repository Collaboration: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_fundamentals_sub2",
                    "subskillName": "Git Version Control & Repository Collaboration: Component Structure & Memory",
                    "prerequisites": [
                      "dev_git_fundamentals_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_fundamentals_sub3",
                    "subskillName": "Git Version Control & Repository Collaboration: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_git_fundamentals_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_fundamentals_sub4",
                    "subskillName": "Git Version Control & Repository Collaboration: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_git_fundamentals_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_fundamentals_sub5",
                    "subskillName": "Git Version Control & Repository Collaboration: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_git_fundamentals_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_fundamentals_sub6",
                    "subskillName": "Git Version Control & Repository Collaboration: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_git_fundamentals_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_ssh_key_management",
                "skillName": "SSH Key Pairs, Bastion Hosts & Secure Shell Access",
                "prerequisites": [
                  "dev_linux_files"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_ssh_key_management_sub1",
                    "subskillName": "SSH Key Pairs, Bastion Hosts & Secure Shell Access: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ssh_key_management_sub2",
                    "subskillName": "SSH Key Pairs, Bastion Hosts & Secure Shell Access: Component Structure & Memory",
                    "prerequisites": [
                      "dev_ssh_key_management_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ssh_key_management_sub3",
                    "subskillName": "SSH Key Pairs, Bastion Hosts & Secure Shell Access: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_ssh_key_management_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ssh_key_management_sub4",
                    "subskillName": "SSH Key Pairs, Bastion Hosts & Secure Shell Access: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_ssh_key_management_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ssh_key_management_sub5",
                    "subskillName": "SSH Key Pairs, Bastion Hosts & Secure Shell Access: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_ssh_key_management_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ssh_key_management_sub6",
                    "subskillName": "SSH Key Pairs, Bastion Hosts & Secure Shell Access: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_ssh_key_management_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_webserver_nginx_basics",
                "skillName": "Nginx Web Server Setup & Reverse Proxy Basics",
                "prerequisites": [
                  "dev_systemd_services"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_webserver_nginx_basics_sub1",
                    "subskillName": "Nginx Web Server Setup & Reverse Proxy Basics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_webserver_nginx_basics_sub2",
                    "subskillName": "Nginx Web Server Setup & Reverse Proxy Basics: Component Structure & Memory",
                    "prerequisites": [
                      "dev_webserver_nginx_basics_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_webserver_nginx_basics_sub3",
                    "subskillName": "Nginx Web Server Setup & Reverse Proxy Basics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_webserver_nginx_basics_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_webserver_nginx_basics_sub4",
                    "subskillName": "Nginx Web Server Setup & Reverse Proxy Basics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_webserver_nginx_basics_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_webserver_nginx_basics_sub5",
                    "subskillName": "Nginx Web Server Setup & Reverse Proxy Basics: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_webserver_nginx_basics_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_webserver_nginx_basics_sub6",
                    "subskillName": "Nginx Web Server Setup & Reverse Proxy Basics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_webserver_nginx_basics_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_virtualization_vms",
                "skillName": "Hypervisors, Vagrant & Virtual Machine Provisioning",
                "prerequisites": [
                  "dev_os_net_basics"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_virtualization_vms_sub1",
                    "subskillName": "Hypervisors, Vagrant & Virtual Machine Provisioning: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_virtualization_vms_sub2",
                    "subskillName": "Hypervisors, Vagrant & Virtual Machine Provisioning: Component Structure & Memory",
                    "prerequisites": [
                      "dev_virtualization_vms_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_virtualization_vms_sub3",
                    "subskillName": "Hypervisors, Vagrant & Virtual Machine Provisioning: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_virtualization_vms_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_virtualization_vms_sub4",
                    "subskillName": "Hypervisors, Vagrant & Virtual Machine Provisioning: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_virtualization_vms_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_virtualization_vms_sub5",
                    "subskillName": "Hypervisors, Vagrant & Virtual Machine Provisioning: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_virtualization_vms_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_virtualization_vms_sub6",
                    "subskillName": "Hypervisors, Vagrant & Virtual Machine Provisioning: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_virtualization_vms_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "devops_sub_beginner_3",
            "name": "CIDR Subnetting, Routing Tables & Core Concepts",
            "skills": [
              {
                "skillId": "dev_networking_cidr_dns",
                "skillName": "CIDR Subnetting, Routing Tables & DNS Records",
                "prerequisites": [
                  "dev_os_net_basics"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_networking_cidr_dns_sub1",
                    "subskillName": "CIDR Subnetting, Routing Tables & DNS Records: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_networking_cidr_dns_sub2",
                    "subskillName": "CIDR Subnetting, Routing Tables & DNS Records: Component Structure & Memory",
                    "prerequisites": [
                      "dev_networking_cidr_dns_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_networking_cidr_dns_sub3",
                    "subskillName": "CIDR Subnetting, Routing Tables & DNS Records: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_networking_cidr_dns_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_networking_cidr_dns_sub4",
                    "subskillName": "CIDR Subnetting, Routing Tables & DNS Records: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_networking_cidr_dns_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_networking_cidr_dns_sub5",
                    "subskillName": "CIDR Subnetting, Routing Tables & DNS Records: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_networking_cidr_dns_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_networking_cidr_dns_sub6",
                    "subskillName": "CIDR Subnetting, Routing Tables & DNS Records: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_networking_cidr_dns_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_cron_system_automation",
                "skillName": "Cron Schedulers, System Timers & Log Rotation",
                "prerequisites": [
                  "dev_shell_scripting"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_cron_system_automation_sub1",
                    "subskillName": "Cron Schedulers, System Timers & Log Rotation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cron_system_automation_sub2",
                    "subskillName": "Cron Schedulers, System Timers & Log Rotation: Component Structure & Memory",
                    "prerequisites": [
                      "dev_cron_system_automation_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cron_system_automation_sub3",
                    "subskillName": "Cron Schedulers, System Timers & Log Rotation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_cron_system_automation_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cron_system_automation_sub4",
                    "subskillName": "Cron Schedulers, System Timers & Log Rotation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_cron_system_automation_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cron_system_automation_sub5",
                    "subskillName": "Cron Schedulers, System Timers & Log Rotation: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_cron_system_automation_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cron_system_automation_sub6",
                    "subskillName": "Cron Schedulers, System Timers & Log Rotation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_cron_system_automation_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_package_managers",
                "skillName": "Linux Package Managers (APT/YUM) & Compilation",
                "prerequisites": [
                  "dev_linux_files"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_package_managers_sub1",
                    "subskillName": "Linux Package Managers (APT/YUM) & Compilation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_package_managers_sub2",
                    "subskillName": "Linux Package Managers (APT/YUM) & Compilation: Component Structure & Memory",
                    "prerequisites": [
                      "dev_package_managers_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_package_managers_sub3",
                    "subskillName": "Linux Package Managers (APT/YUM) & Compilation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_package_managers_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_package_managers_sub4",
                    "subskillName": "Linux Package Managers (APT/YUM) & Compilation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_package_managers_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_package_managers_sub5",
                    "subskillName": "Linux Package Managers (APT/YUM) & Compilation: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_package_managers_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_package_managers_sub6",
                    "subskillName": "Linux Package Managers (APT/YUM) & Compilation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_package_managers_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_monitoring_basics",
                "skillName": "System Metrics & Resource Monitoring (top, htop)",
                "prerequisites": [
                  "dev_systemd_services"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dev_monitoring_basics_sub1",
                    "subskillName": "System Metrics & Resource Monitoring (top, htop): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_monitoring_basics_sub2",
                    "subskillName": "System Metrics & Resource Monitoring (top, htop): Component Structure & Memory",
                    "prerequisites": [
                      "dev_monitoring_basics_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_monitoring_basics_sub3",
                    "subskillName": "System Metrics & Resource Monitoring (top, htop): Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_monitoring_basics_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_monitoring_basics_sub4",
                    "subskillName": "System Metrics & Resource Monitoring (top, htop): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_monitoring_basics_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_monitoring_basics_sub5",
                    "subskillName": "System Metrics & Resource Monitoring (top, htop): Integration & Placement Questions",
                    "prerequisites": [
                      "dev_monitoring_basics_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_monitoring_basics_sub6",
                    "subskillName": "System Metrics & Resource Monitoring (top, htop): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_monitoring_basics_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "devops_top_intermediate",
        "name": "Cloud Engineering & DevOps — Intermediate Tier",
        "subtopics": [
          {
            "id": "devops_sub_intermediate_1",
            "name": "Dockerfile Optimization & Core Concepts",
            "skills": [
              {
                "skillId": "dev_dockerfile_builds",
                "skillName": "Dockerfile Optimization & Multi-Stage Builds",
                "prerequisites": [
                  "dev_shell_scripting"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_dockerfile_builds_sub1",
                    "subskillName": "Dockerfile Optimization & Multi-Stage Builds: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_dockerfile_builds_sub2",
                    "subskillName": "Dockerfile Optimization & Multi-Stage Builds: Component Structure & Memory",
                    "prerequisites": [
                      "dev_dockerfile_builds_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_dockerfile_builds_sub3",
                    "subskillName": "Dockerfile Optimization & Multi-Stage Builds: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_dockerfile_builds_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_dockerfile_builds_sub4",
                    "subskillName": "Dockerfile Optimization & Multi-Stage Builds: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_dockerfile_builds_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_dockerfile_builds_sub5",
                    "subskillName": "Dockerfile Optimization & Multi-Stage Builds: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_dockerfile_builds_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_dockerfile_builds_sub6",
                    "subskillName": "Dockerfile Optimization & Multi-Stage Builds: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_dockerfile_builds_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_docker_compose",
                "skillName": "Docker Compose & Multi-Container Networking",
                "prerequisites": [
                  "dev_dockerfile_builds"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_docker_compose_sub1",
                    "subskillName": "Docker Compose & Multi-Container Networking: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_compose_sub2",
                    "subskillName": "Docker Compose & Multi-Container Networking: Component Structure & Memory",
                    "prerequisites": [
                      "dev_docker_compose_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_compose_sub3",
                    "subskillName": "Docker Compose & Multi-Container Networking: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_docker_compose_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_compose_sub4",
                    "subskillName": "Docker Compose & Multi-Container Networking: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_docker_compose_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_compose_sub5",
                    "subskillName": "Docker Compose & Multi-Container Networking: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_docker_compose_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_compose_sub6",
                    "subskillName": "Docker Compose & Multi-Container Networking: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_docker_compose_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_git_workflows",
                "skillName": "Git Branching & Release Management",
                "prerequisites": [
                  "dev_docker_compose"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_git_workflows_sub1",
                    "subskillName": "Git Branching & Release Management: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_workflows_sub2",
                    "subskillName": "Git Branching & Release Management: Component Structure & Memory",
                    "prerequisites": [
                      "dev_git_workflows_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_workflows_sub3",
                    "subskillName": "Git Branching & Release Management: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_git_workflows_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_workflows_sub4",
                    "subskillName": "Git Branching & Release Management: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_git_workflows_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_workflows_sub5",
                    "subskillName": "Git Branching & Release Management: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_git_workflows_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_git_workflows_sub6",
                    "subskillName": "Git Branching & Release Management: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_git_workflows_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_github_actions",
                "skillName": "GitHub Actions CI/CD Workflows",
                "prerequisites": [
                  "dev_git_workflows"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_github_actions_sub1",
                    "subskillName": "GitHub Actions CI/CD Workflows: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_github_actions_sub2",
                    "subskillName": "GitHub Actions CI/CD Workflows: Component Structure & Memory",
                    "prerequisites": [
                      "dev_github_actions_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_github_actions_sub3",
                    "subskillName": "GitHub Actions CI/CD Workflows: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_github_actions_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_github_actions_sub4",
                    "subskillName": "GitHub Actions CI/CD Workflows: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_github_actions_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_github_actions_sub5",
                    "subskillName": "GitHub Actions CI/CD Workflows: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_github_actions_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_github_actions_sub6",
                    "subskillName": "GitHub Actions CI/CD Workflows: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_github_actions_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "devops_sub_intermediate_2",
            "name": "Docker Bridge Networks, Storage Volumes & Core Concepts",
            "skills": [
              {
                "skillId": "dev_docker_networking_volumes",
                "skillName": "Docker Bridge Networks, Storage Volumes & Secrets",
                "prerequisites": [
                  "dev_docker_compose"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_docker_networking_volumes_sub1",
                    "subskillName": "Docker Bridge Networks, Storage Volumes & Secrets: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_networking_volumes_sub2",
                    "subskillName": "Docker Bridge Networks, Storage Volumes & Secrets: Component Structure & Memory",
                    "prerequisites": [
                      "dev_docker_networking_volumes_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_networking_volumes_sub3",
                    "subskillName": "Docker Bridge Networks, Storage Volumes & Secrets: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_docker_networking_volumes_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_networking_volumes_sub4",
                    "subskillName": "Docker Bridge Networks, Storage Volumes & Secrets: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_docker_networking_volumes_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_networking_volumes_sub5",
                    "subskillName": "Docker Bridge Networks, Storage Volumes & Secrets: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_docker_networking_volumes_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_docker_networking_volumes_sub6",
                    "subskillName": "Docker Bridge Networks, Storage Volumes & Secrets: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_docker_networking_volumes_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_aws_ec2_vpc",
                "skillName": "AWS Cloud Foundations: VPC, EC2, S3 & Security Groups",
                "prerequisites": [
                  "dev_docker_compose"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_aws_ec2_vpc_sub1",
                    "subskillName": "AWS Cloud Foundations: VPC, EC2, S3 & Security Groups: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_aws_ec2_vpc_sub2",
                    "subskillName": "AWS Cloud Foundations: VPC, EC2, S3 & Security Groups: Component Structure & Memory",
                    "prerequisites": [
                      "dev_aws_ec2_vpc_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_aws_ec2_vpc_sub3",
                    "subskillName": "AWS Cloud Foundations: VPC, EC2, S3 & Security Groups: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_aws_ec2_vpc_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_aws_ec2_vpc_sub4",
                    "subskillName": "AWS Cloud Foundations: VPC, EC2, S3 & Security Groups: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_aws_ec2_vpc_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_aws_ec2_vpc_sub5",
                    "subskillName": "AWS Cloud Foundations: VPC, EC2, S3 & Security Groups: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_aws_ec2_vpc_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_aws_ec2_vpc_sub6",
                    "subskillName": "AWS Cloud Foundations: VPC, EC2, S3 & Security Groups: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_aws_ec2_vpc_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_ansible_playbooks",
                "skillName": "Ansible Playbooks, Inventory & Idempotent Config",
                "prerequisites": [
                  "dev_shell_scripting"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_ansible_playbooks_sub1",
                    "subskillName": "Ansible Playbooks, Inventory & Idempotent Config: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_playbooks_sub2",
                    "subskillName": "Ansible Playbooks, Inventory & Idempotent Config: Component Structure & Memory",
                    "prerequisites": [
                      "dev_ansible_playbooks_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_playbooks_sub3",
                    "subskillName": "Ansible Playbooks, Inventory & Idempotent Config: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_ansible_playbooks_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_playbooks_sub4",
                    "subskillName": "Ansible Playbooks, Inventory & Idempotent Config: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_ansible_playbooks_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_playbooks_sub5",
                    "subskillName": "Ansible Playbooks, Inventory & Idempotent Config: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_ansible_playbooks_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_playbooks_sub6",
                    "subskillName": "Ansible Playbooks, Inventory & Idempotent Config: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_ansible_playbooks_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_terraform_modules",
                "skillName": "Terraform Modules & Cloud Resource Provisioning",
                "prerequisites": [
                  "dev_aws_ec2_vpc"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_terraform_modules_sub1",
                    "subskillName": "Terraform Modules & Cloud Resource Provisioning: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_modules_sub2",
                    "subskillName": "Terraform Modules & Cloud Resource Provisioning: Component Structure & Memory",
                    "prerequisites": [
                      "dev_terraform_modules_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_modules_sub3",
                    "subskillName": "Terraform Modules & Cloud Resource Provisioning: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_terraform_modules_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_modules_sub4",
                    "subskillName": "Terraform Modules & Cloud Resource Provisioning: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_terraform_modules_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_modules_sub5",
                    "subskillName": "Terraform Modules & Cloud Resource Provisioning: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_terraform_modules_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_modules_sub6",
                    "subskillName": "Terraform Modules & Cloud Resource Provisioning: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_terraform_modules_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "devops_sub_intermediate_3",
            "name": "Prometheus Metrics Scraping & Core Concepts",
            "skills": [
              {
                "skillId": "dev_prometheus_alertmanager",
                "skillName": "Prometheus Metrics Scraping & Alertmanager Rules",
                "prerequisites": [
                  "dev_docker_compose"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_prometheus_alertmanager_sub1",
                    "subskillName": "Prometheus Metrics Scraping & Alertmanager Rules: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_alertmanager_sub2",
                    "subskillName": "Prometheus Metrics Scraping & Alertmanager Rules: Component Structure & Memory",
                    "prerequisites": [
                      "dev_prometheus_alertmanager_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_alertmanager_sub3",
                    "subskillName": "Prometheus Metrics Scraping & Alertmanager Rules: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_prometheus_alertmanager_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_alertmanager_sub4",
                    "subskillName": "Prometheus Metrics Scraping & Alertmanager Rules: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_prometheus_alertmanager_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_alertmanager_sub5",
                    "subskillName": "Prometheus Metrics Scraping & Alertmanager Rules: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_prometheus_alertmanager_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_alertmanager_sub6",
                    "subskillName": "Prometheus Metrics Scraping & Alertmanager Rules: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_prometheus_alertmanager_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_grafana_dashboards",
                "skillName": "Grafana Dashboard Visualizations & Observability",
                "prerequisites": [
                  "dev_prometheus_alertmanager"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_grafana_dashboards_sub1",
                    "subskillName": "Grafana Dashboard Visualizations & Observability: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_grafana_dashboards_sub2",
                    "subskillName": "Grafana Dashboard Visualizations & Observability: Component Structure & Memory",
                    "prerequisites": [
                      "dev_grafana_dashboards_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_grafana_dashboards_sub3",
                    "subskillName": "Grafana Dashboard Visualizations & Observability: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_grafana_dashboards_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_grafana_dashboards_sub4",
                    "subskillName": "Grafana Dashboard Visualizations & Observability: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_grafana_dashboards_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_grafana_dashboards_sub5",
                    "subskillName": "Grafana Dashboard Visualizations & Observability: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_grafana_dashboards_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_grafana_dashboards_sub6",
                    "subskillName": "Grafana Dashboard Visualizations & Observability: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_grafana_dashboards_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_ci_pipeline_security",
                "skillName": "CI/CD Pipeline Security Scanning with Trivy & SonarQube",
                "prerequisites": [
                  "dev_github_actions"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_ci_pipeline_security_sub1",
                    "subskillName": "CI/CD Pipeline Security Scanning with Trivy & SonarQube: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ci_pipeline_security_sub2",
                    "subskillName": "CI/CD Pipeline Security Scanning with Trivy & SonarQube: Component Structure & Memory",
                    "prerequisites": [
                      "dev_ci_pipeline_security_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ci_pipeline_security_sub3",
                    "subskillName": "CI/CD Pipeline Security Scanning with Trivy & SonarQube: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_ci_pipeline_security_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ci_pipeline_security_sub4",
                    "subskillName": "CI/CD Pipeline Security Scanning with Trivy & SonarQube: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_ci_pipeline_security_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ci_pipeline_security_sub5",
                    "subskillName": "CI/CD Pipeline Security Scanning with Trivy & SonarQube: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_ci_pipeline_security_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ci_pipeline_security_sub6",
                    "subskillName": "CI/CD Pipeline Security Scanning with Trivy & SonarQube: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_ci_pipeline_security_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_artifact_nexus_registry",
                "skillName": "Container Registries & Image Lifecycle Policies",
                "prerequisites": [
                  "dev_dockerfile_builds"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dev_artifact_nexus_registry_sub1",
                    "subskillName": "Container Registries & Image Lifecycle Policies: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_artifact_nexus_registry_sub2",
                    "subskillName": "Container Registries & Image Lifecycle Policies: Component Structure & Memory",
                    "prerequisites": [
                      "dev_artifact_nexus_registry_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_artifact_nexus_registry_sub3",
                    "subskillName": "Container Registries & Image Lifecycle Policies: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_artifact_nexus_registry_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_artifact_nexus_registry_sub4",
                    "subskillName": "Container Registries & Image Lifecycle Policies: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_artifact_nexus_registry_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_artifact_nexus_registry_sub5",
                    "subskillName": "Container Registries & Image Lifecycle Policies: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_artifact_nexus_registry_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_artifact_nexus_registry_sub6",
                    "subskillName": "Container Registries & Image Lifecycle Policies: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_artifact_nexus_registry_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "devops_top_advanced",
        "name": "Cloud Engineering & DevOps — Advanced Tier",
        "subtopics": [
          {
            "id": "devops_sub_advanced_1",
            "name": "Kubernetes Pods, Deployments & Core Concepts",
            "skills": [
              {
                "skillId": "dev_k8s_pods_services",
                "skillName": "Kubernetes Pods, Deployments & Services",
                "prerequisites": [
                  "dev_github_actions"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_k8s_pods_services_sub1",
                    "subskillName": "Kubernetes Pods, Deployments & Services: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_pods_services_sub2",
                    "subskillName": "Kubernetes Pods, Deployments & Services: Component Structure & Memory",
                    "prerequisites": [
                      "dev_k8s_pods_services_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_pods_services_sub3",
                    "subskillName": "Kubernetes Pods, Deployments & Services: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_k8s_pods_services_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_pods_services_sub4",
                    "subskillName": "Kubernetes Pods, Deployments & Services: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_k8s_pods_services_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_pods_services_sub5",
                    "subskillName": "Kubernetes Pods, Deployments & Services: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_k8s_pods_services_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_pods_services_sub6",
                    "subskillName": "Kubernetes Pods, Deployments & Services: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_k8s_pods_services_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_k8s_ingress_helm",
                "skillName": "Kubernetes Ingress & Helm Chart Deployment",
                "prerequisites": [
                  "dev_k8s_pods_services"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_k8s_ingress_helm_sub1",
                    "subskillName": "Kubernetes Ingress & Helm Chart Deployment: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_ingress_helm_sub2",
                    "subskillName": "Kubernetes Ingress & Helm Chart Deployment: Component Structure & Memory",
                    "prerequisites": [
                      "dev_k8s_ingress_helm_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_ingress_helm_sub3",
                    "subskillName": "Kubernetes Ingress & Helm Chart Deployment: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_k8s_ingress_helm_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_ingress_helm_sub4",
                    "subskillName": "Kubernetes Ingress & Helm Chart Deployment: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_k8s_ingress_helm_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_ingress_helm_sub5",
                    "subskillName": "Kubernetes Ingress & Helm Chart Deployment: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_k8s_ingress_helm_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_ingress_helm_sub6",
                    "subskillName": "Kubernetes Ingress & Helm Chart Deployment: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_k8s_ingress_helm_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_terraform_hcl",
                "skillName": "Terraform Syntax & HCL State Management",
                "prerequisites": [
                  "dev_k8s_ingress_helm"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_terraform_hcl_sub1",
                    "subskillName": "Terraform Syntax & HCL State Management: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_hcl_sub2",
                    "subskillName": "Terraform Syntax & HCL State Management: Component Structure & Memory",
                    "prerequisites": [
                      "dev_terraform_hcl_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_hcl_sub3",
                    "subskillName": "Terraform Syntax & HCL State Management: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_terraform_hcl_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_hcl_sub4",
                    "subskillName": "Terraform Syntax & HCL State Management: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_terraform_hcl_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_hcl_sub5",
                    "subskillName": "Terraform Syntax & HCL State Management: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_terraform_hcl_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_terraform_hcl_sub6",
                    "subskillName": "Terraform Syntax & HCL State Management: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_terraform_hcl_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_ansible_config",
                "skillName": "Ansible Playbooks & Configuration Management",
                "prerequisites": [
                  "dev_terraform_hcl"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_ansible_config_sub1",
                    "subskillName": "Ansible Playbooks & Configuration Management: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_config_sub2",
                    "subskillName": "Ansible Playbooks & Configuration Management: Component Structure & Memory",
                    "prerequisites": [
                      "dev_ansible_config_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_config_sub3",
                    "subskillName": "Ansible Playbooks & Configuration Management: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_ansible_config_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_config_sub4",
                    "subskillName": "Ansible Playbooks & Configuration Management: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_ansible_config_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_config_sub5",
                    "subskillName": "Ansible Playbooks & Configuration Management: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_ansible_config_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_ansible_config_sub6",
                    "subskillName": "Ansible Playbooks & Configuration Management: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_ansible_config_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "devops_sub_advanced_2",
            "name": "Prometheus Metrics & Core Concepts",
            "skills": [
              {
                "skillId": "dev_prometheus_grafana",
                "skillName": "Prometheus Metrics & Grafana Dashboards",
                "prerequisites": [
                  "dev_ansible_config"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_prometheus_grafana_sub1",
                    "subskillName": "Prometheus Metrics & Grafana Dashboards: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_grafana_sub2",
                    "subskillName": "Prometheus Metrics & Grafana Dashboards: Component Structure & Memory",
                    "prerequisites": [
                      "dev_prometheus_grafana_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_grafana_sub3",
                    "subskillName": "Prometheus Metrics & Grafana Dashboards: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_prometheus_grafana_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_grafana_sub4",
                    "subskillName": "Prometheus Metrics & Grafana Dashboards: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_prometheus_grafana_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_grafana_sub5",
                    "subskillName": "Prometheus Metrics & Grafana Dashboards: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_prometheus_grafana_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_prometheus_grafana_sub6",
                    "subskillName": "Prometheus Metrics & Grafana Dashboards: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_prometheus_grafana_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_cloud_sec_capstone",
                "skillName": "Cloud Architecture & Disaster Recovery Capstone",
                "prerequisites": [
                  "dev_prometheus_grafana"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_cloud_sec_capstone_sub1",
                    "subskillName": "Cloud Architecture & Disaster Recovery Capstone: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cloud_sec_capstone_sub2",
                    "subskillName": "Cloud Architecture & Disaster Recovery Capstone: Component Structure & Memory",
                    "prerequisites": [
                      "dev_cloud_sec_capstone_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cloud_sec_capstone_sub3",
                    "subskillName": "Cloud Architecture & Disaster Recovery Capstone: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_cloud_sec_capstone_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cloud_sec_capstone_sub4",
                    "subskillName": "Cloud Architecture & Disaster Recovery Capstone: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_cloud_sec_capstone_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cloud_sec_capstone_sub5",
                    "subskillName": "Cloud Architecture & Disaster Recovery Capstone: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_cloud_sec_capstone_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_cloud_sec_capstone_sub6",
                    "subskillName": "Cloud Architecture & Disaster Recovery Capstone: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_cloud_sec_capstone_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_k8s_config_storage",
                "skillName": "Kubernetes StatefulSets, PersistentVolumes & ConfigMaps",
                "prerequisites": [
                  "dev_k8s_pods_services"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_k8s_config_storage_sub1",
                    "subskillName": "Kubernetes StatefulSets, PersistentVolumes & ConfigMaps: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_config_storage_sub2",
                    "subskillName": "Kubernetes StatefulSets, PersistentVolumes & ConfigMaps: Component Structure & Memory",
                    "prerequisites": [
                      "dev_k8s_config_storage_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_config_storage_sub3",
                    "subskillName": "Kubernetes StatefulSets, PersistentVolumes & ConfigMaps: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_k8s_config_storage_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_config_storage_sub4",
                    "subskillName": "Kubernetes StatefulSets, PersistentVolumes & ConfigMaps: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_k8s_config_storage_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_config_storage_sub5",
                    "subskillName": "Kubernetes StatefulSets, PersistentVolumes & ConfigMaps: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_k8s_config_storage_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_config_storage_sub6",
                    "subskillName": "Kubernetes StatefulSets, PersistentVolumes & ConfigMaps: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_k8s_config_storage_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_k8s_rbac_security",
                "skillName": "Kubernetes RBAC, NetworkPolicies & Security Contexts",
                "prerequisites": [
                  "dev_k8s_ingress_helm"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_k8s_rbac_security_sub1",
                    "subskillName": "Kubernetes RBAC, NetworkPolicies & Security Contexts: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_rbac_security_sub2",
                    "subskillName": "Kubernetes RBAC, NetworkPolicies & Security Contexts: Component Structure & Memory",
                    "prerequisites": [
                      "dev_k8s_rbac_security_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_rbac_security_sub3",
                    "subskillName": "Kubernetes RBAC, NetworkPolicies & Security Contexts: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_k8s_rbac_security_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_rbac_security_sub4",
                    "subskillName": "Kubernetes RBAC, NetworkPolicies & Security Contexts: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_k8s_rbac_security_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_rbac_security_sub5",
                    "subskillName": "Kubernetes RBAC, NetworkPolicies & Security Contexts: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_k8s_rbac_security_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_k8s_rbac_security_sub6",
                    "subskillName": "Kubernetes RBAC, NetworkPolicies & Security Contexts: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_k8s_rbac_security_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "devops_sub_advanced_3",
            "name": "GitOps Continuous Delivery with ArgoCD & Core Concepts",
            "skills": [
              {
                "skillId": "dev_argocd_gitops",
                "skillName": "GitOps Continuous Delivery with ArgoCD & Flux",
                "prerequisites": [
                  "dev_k8s_ingress_helm"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_argocd_gitops_sub1",
                    "subskillName": "GitOps Continuous Delivery with ArgoCD & Flux: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_argocd_gitops_sub2",
                    "subskillName": "GitOps Continuous Delivery with ArgoCD & Flux: Component Structure & Memory",
                    "prerequisites": [
                      "dev_argocd_gitops_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_argocd_gitops_sub3",
                    "subskillName": "GitOps Continuous Delivery with ArgoCD & Flux: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_argocd_gitops_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_argocd_gitops_sub4",
                    "subskillName": "GitOps Continuous Delivery with ArgoCD & Flux: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_argocd_gitops_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_argocd_gitops_sub5",
                    "subskillName": "GitOps Continuous Delivery with ArgoCD & Flux: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_argocd_gitops_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_argocd_gitops_sub6",
                    "subskillName": "GitOps Continuous Delivery with ArgoCD & Flux: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_argocd_gitops_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_service_mesh_istio",
                "skillName": "Service Mesh Architecture with Istio & Envoy Proxy",
                "prerequisites": [
                  "dev_k8s_ingress_helm"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_service_mesh_istio_sub1",
                    "subskillName": "Service Mesh Architecture with Istio & Envoy Proxy: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_service_mesh_istio_sub2",
                    "subskillName": "Service Mesh Architecture with Istio & Envoy Proxy: Component Structure & Memory",
                    "prerequisites": [
                      "dev_service_mesh_istio_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_service_mesh_istio_sub3",
                    "subskillName": "Service Mesh Architecture with Istio & Envoy Proxy: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_service_mesh_istio_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_service_mesh_istio_sub4",
                    "subskillName": "Service Mesh Architecture with Istio & Envoy Proxy: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_service_mesh_istio_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_service_mesh_istio_sub5",
                    "subskillName": "Service Mesh Architecture with Istio & Envoy Proxy: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_service_mesh_istio_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_service_mesh_istio_sub6",
                    "subskillName": "Service Mesh Architecture with Istio & Envoy Proxy: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_service_mesh_istio_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_sre_slo_sli",
                "skillName": "Site Reliability Engineering, SLOs, SLIs & Error Budgets",
                "prerequisites": [
                  "dev_prometheus_grafana"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_sre_slo_sli_sub1",
                    "subskillName": "Site Reliability Engineering, SLOs, SLIs & Error Budgets: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_sre_slo_sli_sub2",
                    "subskillName": "Site Reliability Engineering, SLOs, SLIs & Error Budgets: Component Structure & Memory",
                    "prerequisites": [
                      "dev_sre_slo_sli_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_sre_slo_sli_sub3",
                    "subskillName": "Site Reliability Engineering, SLOs, SLIs & Error Budgets: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_sre_slo_sli_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_sre_slo_sli_sub4",
                    "subskillName": "Site Reliability Engineering, SLOs, SLIs & Error Budgets: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_sre_slo_sli_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_sre_slo_sli_sub5",
                    "subskillName": "Site Reliability Engineering, SLOs, SLIs & Error Budgets: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_sre_slo_sli_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_sre_slo_sli_sub6",
                    "subskillName": "Site Reliability Engineering, SLOs, SLIs & Error Budgets: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_sre_slo_sli_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dev_multi_cloud_dr",
                "skillName": "Multi-Region Disaster Recovery & Infrastructure Resilience",
                "prerequisites": [
                  "dev_cloud_sec_capstone"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dev_multi_cloud_dr_sub1",
                    "subskillName": "Multi-Region Disaster Recovery & Infrastructure Resilience: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_multi_cloud_dr_sub2",
                    "subskillName": "Multi-Region Disaster Recovery & Infrastructure Resilience: Component Structure & Memory",
                    "prerequisites": [
                      "dev_multi_cloud_dr_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_multi_cloud_dr_sub3",
                    "subskillName": "Multi-Region Disaster Recovery & Infrastructure Resilience: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dev_multi_cloud_dr_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_multi_cloud_dr_sub4",
                    "subskillName": "Multi-Region Disaster Recovery & Infrastructure Resilience: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dev_multi_cloud_dr_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_multi_cloud_dr_sub5",
                    "subskillName": "Multi-Region Disaster Recovery & Infrastructure Resilience: Integration & Placement Questions",
                    "prerequisites": [
                      "dev_multi_cloud_dr_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dev_multi_cloud_dr_sub6",
                    "subskillName": "Multi-Region Disaster Recovery & Infrastructure Resilience: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dev_multi_cloud_dr_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "dsa": {
    "domainId": "dsa",
    "domainName": "Data Structures & Algorithms (Interview Prep)",
    "topics": [
      {
        "id": "dsa_top_beginner",
        "name": "Data Structures & Algorithms (Interview Prep) — Beginner Tier",
        "subtopics": [
          {
            "id": "dsa_sub_beginner_1",
            "name": "Programming Basics & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_programming_basics",
                "skillName": "Programming Basics",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_programming_basics_sub1",
                    "subskillName": "Programming Basics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_programming_basics_sub2",
                    "subskillName": "Programming Basics: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_programming_basics_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_programming_basics_sub3",
                    "subskillName": "Programming Basics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_programming_basics_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_programming_basics_sub4",
                    "subskillName": "Programming Basics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_programming_basics_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_programming_basics_sub5",
                    "subskillName": "Programming Basics: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_programming_basics_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_programming_basics_sub6",
                    "subskillName": "Programming Basics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_programming_basics_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_control_flow",
                "skillName": "Conditionals, Loops & Basic Problems",
                "prerequisites": [
                  "dsa_programming_basics"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_control_flow_sub1",
                    "subskillName": "Conditionals, Loops & Basic Problems: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_control_flow_sub2",
                    "subskillName": "Conditionals, Loops & Basic Problems: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_control_flow_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_control_flow_sub3",
                    "subskillName": "Conditionals, Loops & Basic Problems: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_control_flow_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_control_flow_sub4",
                    "subskillName": "Conditionals, Loops & Basic Problems: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_control_flow_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_control_flow_sub5",
                    "subskillName": "Conditionals, Loops & Basic Problems: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_control_flow_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_control_flow_sub6",
                    "subskillName": "Conditionals, Loops & Basic Problems: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_control_flow_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_functions_arrays_strings",
                "skillName": "Functions, Arrays & Strings",
                "prerequisites": [
                  "dsa_control_flow"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_functions_arrays_strings_sub1",
                    "subskillName": "Functions, Arrays & Strings: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_functions_arrays_strings_sub2",
                    "subskillName": "Functions, Arrays & Strings: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_functions_arrays_strings_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_functions_arrays_strings_sub3",
                    "subskillName": "Functions, Arrays & Strings: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_functions_arrays_strings_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_functions_arrays_strings_sub4",
                    "subskillName": "Functions, Arrays & Strings: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_functions_arrays_strings_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_functions_arrays_strings_sub5",
                    "subskillName": "Functions, Arrays & Strings: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_functions_arrays_strings_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_functions_arrays_strings_sub6",
                    "subskillName": "Functions, Arrays & Strings: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_functions_arrays_strings_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_big_o_analysis",
                "skillName": "Big-O Time & Space Complexity",
                "prerequisites": [
                  "dsa_functions_arrays_strings"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_big_o_analysis_sub1",
                    "subskillName": "Big-O Time & Space Complexity: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_big_o_analysis_sub2",
                    "subskillName": "Big-O Time & Space Complexity: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_big_o_analysis_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_big_o_analysis_sub3",
                    "subskillName": "Big-O Time & Space Complexity: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_big_o_analysis_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_big_o_analysis_sub4",
                    "subskillName": "Big-O Time & Space Complexity: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_big_o_analysis_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_big_o_analysis_sub5",
                    "subskillName": "Big-O Time & Space Complexity: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_big_o_analysis_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_big_o_analysis_sub6",
                    "subskillName": "Big-O Time & Space Complexity: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_big_o_analysis_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "dsa_sub_beginner_2",
            "name": "Recursion Fundamentals & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_recursion_basics",
                "skillName": "Recursion Fundamentals & Call Stack",
                "prerequisites": [
                  "dsa_big_o_analysis"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_recursion_basics_sub1",
                    "subskillName": "Recursion Fundamentals & Call Stack: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_recursion_basics_sub2",
                    "subskillName": "Recursion Fundamentals & Call Stack: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_recursion_basics_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_recursion_basics_sub3",
                    "subskillName": "Recursion Fundamentals & Call Stack: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_recursion_basics_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_recursion_basics_sub4",
                    "subskillName": "Recursion Fundamentals & Call Stack: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_recursion_basics_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_recursion_basics_sub5",
                    "subskillName": "Recursion Fundamentals & Call Stack: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_recursion_basics_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_recursion_basics_sub6",
                    "subskillName": "Recursion Fundamentals & Call Stack: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_recursion_basics_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_array_hashmaps",
                "skillName": "Array Mutation & Hash Map O(1) Lookups",
                "prerequisites": [
                  "dsa_big_o_analysis"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_array_hashmaps_sub1",
                    "subskillName": "Array Mutation & Hash Map O(1) Lookups: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_array_hashmaps_sub2",
                    "subskillName": "Array Mutation & Hash Map O(1) Lookups: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_array_hashmaps_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_array_hashmaps_sub3",
                    "subskillName": "Array Mutation & Hash Map O(1) Lookups: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_array_hashmaps_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_array_hashmaps_sub4",
                    "subskillName": "Array Mutation & Hash Map O(1) Lookups: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_array_hashmaps_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_array_hashmaps_sub5",
                    "subskillName": "Array Mutation & Hash Map O(1) Lookups: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_array_hashmaps_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_array_hashmaps_sub6",
                    "subskillName": "Array Mutation & Hash Map O(1) Lookups: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_array_hashmaps_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_two_pointers",
                "skillName": "Two Pointers Technique & In-Place Mutation",
                "prerequisites": [
                  "dsa_array_hashmaps"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_two_pointers_sub1",
                    "subskillName": "Two Pointers Technique & In-Place Mutation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_two_pointers_sub2",
                    "subskillName": "Two Pointers Technique & In-Place Mutation: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_two_pointers_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_two_pointers_sub3",
                    "subskillName": "Two Pointers Technique & In-Place Mutation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_two_pointers_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_two_pointers_sub4",
                    "subskillName": "Two Pointers Technique & In-Place Mutation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_two_pointers_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_two_pointers_sub5",
                    "subskillName": "Two Pointers Technique & In-Place Mutation: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_two_pointers_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_two_pointers_sub6",
                    "subskillName": "Two Pointers Technique & In-Place Mutation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_two_pointers_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_sliding_window",
                "skillName": "Sliding Window (Fixed & Dynamic)",
                "prerequisites": [
                  "dsa_two_pointers"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_sliding_window_sub1",
                    "subskillName": "Sliding Window (Fixed & Dynamic): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sliding_window_sub2",
                    "subskillName": "Sliding Window (Fixed & Dynamic): Component Structure & Memory",
                    "prerequisites": [
                      "dsa_sliding_window_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sliding_window_sub3",
                    "subskillName": "Sliding Window (Fixed & Dynamic): Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_sliding_window_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sliding_window_sub4",
                    "subskillName": "Sliding Window (Fixed & Dynamic): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_sliding_window_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sliding_window_sub5",
                    "subskillName": "Sliding Window (Fixed & Dynamic): Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_sliding_window_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sliding_window_sub6",
                    "subskillName": "Sliding Window (Fixed & Dynamic): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_sliding_window_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "dsa_sub_beginner_3",
            "name": "Binary Search & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_linear_binary_search",
                "skillName": "Binary Search & Search Space Reduction",
                "prerequisites": [
                  "dsa_big_o_analysis"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_linear_binary_search_sub1",
                    "subskillName": "Binary Search & Search Space Reduction: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linear_binary_search_sub2",
                    "subskillName": "Binary Search & Search Space Reduction: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_linear_binary_search_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linear_binary_search_sub3",
                    "subskillName": "Binary Search & Search Space Reduction: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_linear_binary_search_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linear_binary_search_sub4",
                    "subskillName": "Binary Search & Search Space Reduction: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_linear_binary_search_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linear_binary_search_sub5",
                    "subskillName": "Binary Search & Search Space Reduction: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_linear_binary_search_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linear_binary_search_sub6",
                    "subskillName": "Binary Search & Search Space Reduction: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_linear_binary_search_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_sorting_algorithms",
                "skillName": "Merge Sort, Quick Sort & In-Place Partitioning",
                "prerequisites": [
                  "dsa_recursion_basics"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_sorting_algorithms_sub1",
                    "subskillName": "Merge Sort, Quick Sort & In-Place Partitioning: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sorting_algorithms_sub2",
                    "subskillName": "Merge Sort, Quick Sort & In-Place Partitioning: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_sorting_algorithms_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sorting_algorithms_sub3",
                    "subskillName": "Merge Sort, Quick Sort & In-Place Partitioning: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_sorting_algorithms_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sorting_algorithms_sub4",
                    "subskillName": "Merge Sort, Quick Sort & In-Place Partitioning: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_sorting_algorithms_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sorting_algorithms_sub5",
                    "subskillName": "Merge Sort, Quick Sort & In-Place Partitioning: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_sorting_algorithms_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_sorting_algorithms_sub6",
                    "subskillName": "Merge Sort, Quick Sort & In-Place Partitioning: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_sorting_algorithms_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_matrix_traversal",
                "skillName": "2D Matrices, Spiral Traversal & Grid Rotations",
                "prerequisites": [
                  "dsa_functions_arrays_strings"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_matrix_traversal_sub1",
                    "subskillName": "2D Matrices, Spiral Traversal & Grid Rotations: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_matrix_traversal_sub2",
                    "subskillName": "2D Matrices, Spiral Traversal & Grid Rotations: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_matrix_traversal_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_matrix_traversal_sub3",
                    "subskillName": "2D Matrices, Spiral Traversal & Grid Rotations: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_matrix_traversal_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_matrix_traversal_sub4",
                    "subskillName": "2D Matrices, Spiral Traversal & Grid Rotations: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_matrix_traversal_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_matrix_traversal_sub5",
                    "subskillName": "2D Matrices, Spiral Traversal & Grid Rotations: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_matrix_traversal_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_matrix_traversal_sub6",
                    "subskillName": "2D Matrices, Spiral Traversal & Grid Rotations: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_matrix_traversal_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_bitwise_manipulation",
                "skillName": "Bitwise Operators, Bitmasks & Power-of-Two Tricks",
                "prerequisites": [
                  "dsa_control_flow"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "dsa_bitwise_manipulation_sub1",
                    "subskillName": "Bitwise Operators, Bitmasks & Power-of-Two Tricks: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bitwise_manipulation_sub2",
                    "subskillName": "Bitwise Operators, Bitmasks & Power-of-Two Tricks: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_bitwise_manipulation_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bitwise_manipulation_sub3",
                    "subskillName": "Bitwise Operators, Bitmasks & Power-of-Two Tricks: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_bitwise_manipulation_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bitwise_manipulation_sub4",
                    "subskillName": "Bitwise Operators, Bitmasks & Power-of-Two Tricks: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_bitwise_manipulation_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bitwise_manipulation_sub5",
                    "subskillName": "Bitwise Operators, Bitmasks & Power-of-Two Tricks: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_bitwise_manipulation_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bitwise_manipulation_sub6",
                    "subskillName": "Bitwise Operators, Bitmasks & Power-of-Two Tricks: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_bitwise_manipulation_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "dsa_top_intermediate",
        "name": "Data Structures & Algorithms (Interview Prep) — Intermediate Tier",
        "subtopics": [
          {
            "id": "dsa_sub_intermediate_1",
            "name": "Fast & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_floyd_pointers",
                "skillName": "Fast & Slow Pointers (Cycle Detection)",
                "prerequisites": [
                  "dsa_sliding_window"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_floyd_pointers_sub1",
                    "subskillName": "Fast & Slow Pointers (Cycle Detection): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_floyd_pointers_sub2",
                    "subskillName": "Fast & Slow Pointers (Cycle Detection): Component Structure & Memory",
                    "prerequisites": [
                      "dsa_floyd_pointers_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_floyd_pointers_sub3",
                    "subskillName": "Fast & Slow Pointers (Cycle Detection): Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_floyd_pointers_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_floyd_pointers_sub4",
                    "subskillName": "Fast & Slow Pointers (Cycle Detection): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_floyd_pointers_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_floyd_pointers_sub5",
                    "subskillName": "Fast & Slow Pointers (Cycle Detection): Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_floyd_pointers_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_floyd_pointers_sub6",
                    "subskillName": "Fast & Slow Pointers (Cycle Detection): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_floyd_pointers_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_stacks_parentheses",
                "skillName": "Stack LIFO Operations & Valid Parentheses",
                "prerequisites": [
                  "dsa_floyd_pointers"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_stacks_parentheses_sub1",
                    "subskillName": "Stack LIFO Operations & Valid Parentheses: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_stacks_parentheses_sub2",
                    "subskillName": "Stack LIFO Operations & Valid Parentheses: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_stacks_parentheses_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_stacks_parentheses_sub3",
                    "subskillName": "Stack LIFO Operations & Valid Parentheses: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_stacks_parentheses_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_stacks_parentheses_sub4",
                    "subskillName": "Stack LIFO Operations & Valid Parentheses: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_stacks_parentheses_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_stacks_parentheses_sub5",
                    "subskillName": "Stack LIFO Operations & Valid Parentheses: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_stacks_parentheses_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_stacks_parentheses_sub6",
                    "subskillName": "Stack LIFO Operations & Valid Parentheses: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_stacks_parentheses_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_monotonic_stacks",
                "skillName": "Monotonic Stack Pattern",
                "prerequisites": [
                  "dsa_stacks_parentheses"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_monotonic_stacks_sub1",
                    "subskillName": "Monotonic Stack Pattern: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_monotonic_stacks_sub2",
                    "subskillName": "Monotonic Stack Pattern: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_monotonic_stacks_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_monotonic_stacks_sub3",
                    "subskillName": "Monotonic Stack Pattern: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_monotonic_stacks_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_monotonic_stacks_sub4",
                    "subskillName": "Monotonic Stack Pattern: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_monotonic_stacks_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_monotonic_stacks_sub5",
                    "subskillName": "Monotonic Stack Pattern: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_monotonic_stacks_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_monotonic_stacks_sub6",
                    "subskillName": "Monotonic Stack Pattern: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_monotonic_stacks_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_bst_operations",
                "skillName": "Binary Search Tree Search & In-Order Traversal",
                "prerequisites": [
                  "dsa_monotonic_stacks"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_bst_operations_sub1",
                    "subskillName": "Binary Search Tree Search & In-Order Traversal: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bst_operations_sub2",
                    "subskillName": "Binary Search Tree Search & In-Order Traversal: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_bst_operations_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bst_operations_sub3",
                    "subskillName": "Binary Search Tree Search & In-Order Traversal: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_bst_operations_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bst_operations_sub4",
                    "subskillName": "Binary Search Tree Search & In-Order Traversal: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_bst_operations_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bst_operations_sub5",
                    "subskillName": "Binary Search Tree Search & In-Order Traversal: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_bst_operations_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bst_operations_sub6",
                    "subskillName": "Binary Search Tree Search & In-Order Traversal: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_bst_operations_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "dsa_sub_intermediate_2",
            "name": "Min/Max Heap & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_heaps_priority",
                "skillName": "Min/Max Heap & Priority Queue",
                "prerequisites": [
                  "dsa_bst_operations"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_heaps_priority_sub1",
                    "subskillName": "Min/Max Heap & Priority Queue: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_heaps_priority_sub2",
                    "subskillName": "Min/Max Heap & Priority Queue: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_heaps_priority_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_heaps_priority_sub3",
                    "subskillName": "Min/Max Heap & Priority Queue: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_heaps_priority_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_heaps_priority_sub4",
                    "subskillName": "Min/Max Heap & Priority Queue: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_heaps_priority_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_heaps_priority_sub5",
                    "subskillName": "Min/Max Heap & Priority Queue: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_heaps_priority_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_heaps_priority_sub6",
                    "subskillName": "Min/Max Heap & Priority Queue: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_heaps_priority_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_linked_list_reversal",
                "skillName": "Linked List Reversal, Merging & Reordering",
                "prerequisites": [
                  "dsa_floyd_pointers"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_linked_list_reversal_sub1",
                    "subskillName": "Linked List Reversal, Merging & Reordering: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linked_list_reversal_sub2",
                    "subskillName": "Linked List Reversal, Merging & Reordering: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_linked_list_reversal_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linked_list_reversal_sub3",
                    "subskillName": "Linked List Reversal, Merging & Reordering: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_linked_list_reversal_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linked_list_reversal_sub4",
                    "subskillName": "Linked List Reversal, Merging & Reordering: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_linked_list_reversal_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linked_list_reversal_sub5",
                    "subskillName": "Linked List Reversal, Merging & Reordering: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_linked_list_reversal_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_linked_list_reversal_sub6",
                    "subskillName": "Linked List Reversal, Merging & Reordering: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_linked_list_reversal_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_queues_deques",
                "skillName": "Queues, Deques & Sliding Window Maximum",
                "prerequisites": [
                  "dsa_stacks_parentheses"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_queues_deques_sub1",
                    "subskillName": "Queues, Deques & Sliding Window Maximum: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_queues_deques_sub2",
                    "subskillName": "Queues, Deques & Sliding Window Maximum: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_queues_deques_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_queues_deques_sub3",
                    "subskillName": "Queues, Deques & Sliding Window Maximum: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_queues_deques_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_queues_deques_sub4",
                    "subskillName": "Queues, Deques & Sliding Window Maximum: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_queues_deques_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_queues_deques_sub5",
                    "subskillName": "Queues, Deques & Sliding Window Maximum: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_queues_deques_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_queues_deques_sub6",
                    "subskillName": "Queues, Deques & Sliding Window Maximum: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_queues_deques_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_tree_traversals",
                "skillName": "Binary Tree Traversals (Level-Order & Recursive)",
                "prerequisites": [
                  "dsa_bst_operations"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_tree_traversals_sub1",
                    "subskillName": "Binary Tree Traversals (Level-Order & Recursive): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_traversals_sub2",
                    "subskillName": "Binary Tree Traversals (Level-Order & Recursive): Component Structure & Memory",
                    "prerequisites": [
                      "dsa_tree_traversals_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_traversals_sub3",
                    "subskillName": "Binary Tree Traversals (Level-Order & Recursive): Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_tree_traversals_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_traversals_sub4",
                    "subskillName": "Binary Tree Traversals (Level-Order & Recursive): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_tree_traversals_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_traversals_sub5",
                    "subskillName": "Binary Tree Traversals (Level-Order & Recursive): Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_tree_traversals_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_traversals_sub6",
                    "subskillName": "Binary Tree Traversals (Level-Order & Recursive): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_tree_traversals_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "dsa_sub_intermediate_3",
            "name": "Lowest Common Ancestor & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_tree_lowest_common_ancestor",
                "skillName": "Lowest Common Ancestor & Path Sum Analysis",
                "prerequisites": [
                  "dsa_tree_traversals"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_tree_lowest_common_ancestor_sub1",
                    "subskillName": "Lowest Common Ancestor & Path Sum Analysis: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_lowest_common_ancestor_sub2",
                    "subskillName": "Lowest Common Ancestor & Path Sum Analysis: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_tree_lowest_common_ancestor_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_lowest_common_ancestor_sub3",
                    "subskillName": "Lowest Common Ancestor & Path Sum Analysis: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_tree_lowest_common_ancestor_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_lowest_common_ancestor_sub4",
                    "subskillName": "Lowest Common Ancestor & Path Sum Analysis: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_tree_lowest_common_ancestor_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_lowest_common_ancestor_sub5",
                    "subskillName": "Lowest Common Ancestor & Path Sum Analysis: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_tree_lowest_common_ancestor_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_tree_lowest_common_ancestor_sub6",
                    "subskillName": "Lowest Common Ancestor & Path Sum Analysis: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_tree_lowest_common_ancestor_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_backtracking_subsets",
                "skillName": "Backtracking: Subsets, Permutations & Combinations",
                "prerequisites": [
                  "dsa_recursion_basics"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_backtracking_subsets_sub1",
                    "subskillName": "Backtracking: Subsets, Permutations & Combinations: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_backtracking_subsets_sub2",
                    "subskillName": "Backtracking: Subsets, Permutations & Combinations: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_backtracking_subsets_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_backtracking_subsets_sub3",
                    "subskillName": "Backtracking: Subsets, Permutations & Combinations: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_backtracking_subsets_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_backtracking_subsets_sub4",
                    "subskillName": "Backtracking: Subsets, Permutations & Combinations: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_backtracking_subsets_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_backtracking_subsets_sub5",
                    "subskillName": "Backtracking: Subsets, Permutations & Combinations: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_backtracking_subsets_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_backtracking_subsets_sub6",
                    "subskillName": "Backtracking: Subsets, Permutations & Combinations: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_backtracking_subsets_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_greedy_interval_scheduling",
                "skillName": "Greedy Algorithms & Interval Scheduling",
                "prerequisites": [
                  "dsa_heaps_priority"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_greedy_interval_scheduling_sub1",
                    "subskillName": "Greedy Algorithms & Interval Scheduling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_greedy_interval_scheduling_sub2",
                    "subskillName": "Greedy Algorithms & Interval Scheduling: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_greedy_interval_scheduling_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_greedy_interval_scheduling_sub3",
                    "subskillName": "Greedy Algorithms & Interval Scheduling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_greedy_interval_scheduling_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_greedy_interval_scheduling_sub4",
                    "subskillName": "Greedy Algorithms & Interval Scheduling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_greedy_interval_scheduling_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_greedy_interval_scheduling_sub5",
                    "subskillName": "Greedy Algorithms & Interval Scheduling: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_greedy_interval_scheduling_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_greedy_interval_scheduling_sub6",
                    "subskillName": "Greedy Algorithms & Interval Scheduling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_greedy_interval_scheduling_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_trie_prefix_trees",
                "skillName": "Trie Data Structure & Prefix Matching",
                "prerequisites": [
                  "dsa_bst_operations"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "dsa_trie_prefix_trees_sub1",
                    "subskillName": "Trie Data Structure & Prefix Matching: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_trie_prefix_trees_sub2",
                    "subskillName": "Trie Data Structure & Prefix Matching: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_trie_prefix_trees_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_trie_prefix_trees_sub3",
                    "subskillName": "Trie Data Structure & Prefix Matching: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_trie_prefix_trees_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_trie_prefix_trees_sub4",
                    "subskillName": "Trie Data Structure & Prefix Matching: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_trie_prefix_trees_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_trie_prefix_trees_sub5",
                    "subskillName": "Trie Data Structure & Prefix Matching: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_trie_prefix_trees_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_trie_prefix_trees_sub6",
                    "subskillName": "Trie Data Structure & Prefix Matching: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_trie_prefix_trees_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "dsa_top_advanced",
        "name": "Data Structures & Algorithms (Interview Prep) — Advanced Tier",
        "subtopics": [
          {
            "id": "dsa_sub_advanced_1",
            "name": "Breadth-First & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_bfs_dfs_traversal",
                "skillName": "Breadth-First & Depth-First Graph Search",
                "prerequisites": [
                  "dsa_heaps_priority"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_bfs_dfs_traversal_sub1",
                    "subskillName": "Breadth-First & Depth-First Graph Search: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bfs_dfs_traversal_sub2",
                    "subskillName": "Breadth-First & Depth-First Graph Search: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_bfs_dfs_traversal_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bfs_dfs_traversal_sub3",
                    "subskillName": "Breadth-First & Depth-First Graph Search: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_bfs_dfs_traversal_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bfs_dfs_traversal_sub4",
                    "subskillName": "Breadth-First & Depth-First Graph Search: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_bfs_dfs_traversal_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bfs_dfs_traversal_sub5",
                    "subskillName": "Breadth-First & Depth-First Graph Search: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_bfs_dfs_traversal_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bfs_dfs_traversal_sub6",
                    "subskillName": "Breadth-First & Depth-First Graph Search: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_bfs_dfs_traversal_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_dijkstra_shortest",
                "skillName": "Dijkstra Shortest Path & Topological Sort",
                "prerequisites": [
                  "dsa_bfs_dfs_traversal"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_dijkstra_shortest_sub1",
                    "subskillName": "Dijkstra Shortest Path & Topological Sort: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dijkstra_shortest_sub2",
                    "subskillName": "Dijkstra Shortest Path & Topological Sort: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_dijkstra_shortest_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dijkstra_shortest_sub3",
                    "subskillName": "Dijkstra Shortest Path & Topological Sort: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_dijkstra_shortest_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dijkstra_shortest_sub4",
                    "subskillName": "Dijkstra Shortest Path & Topological Sort: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_dijkstra_shortest_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dijkstra_shortest_sub5",
                    "subskillName": "Dijkstra Shortest Path & Topological Sort: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_dijkstra_shortest_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dijkstra_shortest_sub6",
                    "subskillName": "Dijkstra Shortest Path & Topological Sort: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_dijkstra_shortest_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_dp_memo_tabulation",
                "skillName": "Dynamic Programming Memoization vs Tabulation",
                "prerequisites": [
                  "dsa_dijkstra_shortest"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_dp_memo_tabulation_sub1",
                    "subskillName": "Dynamic Programming Memoization vs Tabulation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_memo_tabulation_sub2",
                    "subskillName": "Dynamic Programming Memoization vs Tabulation: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_dp_memo_tabulation_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_memo_tabulation_sub3",
                    "subskillName": "Dynamic Programming Memoization vs Tabulation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_dp_memo_tabulation_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_memo_tabulation_sub4",
                    "subskillName": "Dynamic Programming Memoization vs Tabulation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_dp_memo_tabulation_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_memo_tabulation_sub5",
                    "subskillName": "Dynamic Programming Memoization vs Tabulation: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_dp_memo_tabulation_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_memo_tabulation_sub6",
                    "subskillName": "Dynamic Programming Memoization vs Tabulation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_dp_memo_tabulation_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_dp_knapsack_lcs",
                "skillName": "0/1 Knapsack & Longest Common Subsequence",
                "prerequisites": [
                  "dsa_dp_memo_tabulation"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_dp_knapsack_lcs_sub1",
                    "subskillName": "0/1 Knapsack & Longest Common Subsequence: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_knapsack_lcs_sub2",
                    "subskillName": "0/1 Knapsack & Longest Common Subsequence: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_dp_knapsack_lcs_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_knapsack_lcs_sub3",
                    "subskillName": "0/1 Knapsack & Longest Common Subsequence: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_dp_knapsack_lcs_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_knapsack_lcs_sub4",
                    "subskillName": "0/1 Knapsack & Longest Common Subsequence: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_dp_knapsack_lcs_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_knapsack_lcs_sub5",
                    "subskillName": "0/1 Knapsack & Longest Common Subsequence: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_dp_knapsack_lcs_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_knapsack_lcs_sub6",
                    "subskillName": "0/1 Knapsack & Longest Common Subsequence: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_dp_knapsack_lcs_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "dsa_sub_advanced_2",
            "name": "Directed Acyclic Graphs & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_graph_topological_sort",
                "skillName": "Directed Acyclic Graphs & Course Scheduling",
                "prerequisites": [
                  "dsa_bfs_dfs_traversal"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_graph_topological_sort_sub1",
                    "subskillName": "Directed Acyclic Graphs & Course Scheduling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_topological_sort_sub2",
                    "subskillName": "Directed Acyclic Graphs & Course Scheduling: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_graph_topological_sort_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_topological_sort_sub3",
                    "subskillName": "Directed Acyclic Graphs & Course Scheduling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_graph_topological_sort_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_topological_sort_sub4",
                    "subskillName": "Directed Acyclic Graphs & Course Scheduling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_graph_topological_sort_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_topological_sort_sub5",
                    "subskillName": "Directed Acyclic Graphs & Course Scheduling: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_graph_topological_sort_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_topological_sort_sub6",
                    "subskillName": "Directed Acyclic Graphs & Course Scheduling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_graph_topological_sort_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_graph_union_find_mst",
                "skillName": "Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree",
                "prerequisites": [
                  "dsa_bfs_dfs_traversal"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_graph_union_find_mst_sub1",
                    "subskillName": "Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_union_find_mst_sub2",
                    "subskillName": "Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_graph_union_find_mst_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_union_find_mst_sub3",
                    "subskillName": "Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_graph_union_find_mst_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_union_find_mst_sub4",
                    "subskillName": "Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_graph_union_find_mst_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_union_find_mst_sub5",
                    "subskillName": "Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_graph_union_find_mst_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_graph_union_find_mst_sub6",
                    "subskillName": "Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_graph_union_find_mst_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_bellman_ford_floyd_warshall",
                "skillName": "Shortest Path: Bellman-Ford & Floyd-Warshall",
                "prerequisites": [
                  "dsa_dijkstra_shortest"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_bellman_ford_floyd_warshall_sub1",
                    "subskillName": "Shortest Path: Bellman-Ford & Floyd-Warshall: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bellman_ford_floyd_warshall_sub2",
                    "subskillName": "Shortest Path: Bellman-Ford & Floyd-Warshall: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_bellman_ford_floyd_warshall_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bellman_ford_floyd_warshall_sub3",
                    "subskillName": "Shortest Path: Bellman-Ford & Floyd-Warshall: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_bellman_ford_floyd_warshall_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bellman_ford_floyd_warshall_sub4",
                    "subskillName": "Shortest Path: Bellman-Ford & Floyd-Warshall: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_bellman_ford_floyd_warshall_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bellman_ford_floyd_warshall_sub5",
                    "subskillName": "Shortest Path: Bellman-Ford & Floyd-Warshall: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_bellman_ford_floyd_warshall_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_bellman_ford_floyd_warshall_sub6",
                    "subskillName": "Shortest Path: Bellman-Ford & Floyd-Warshall: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_bellman_ford_floyd_warshall_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_dp_interval_partition",
                "skillName": "Matrix Chain Multiplication & Palindrome Partitioning",
                "prerequisites": [
                  "dsa_dp_memo_tabulation"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_dp_interval_partition_sub1",
                    "subskillName": "Matrix Chain Multiplication & Palindrome Partitioning: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_interval_partition_sub2",
                    "subskillName": "Matrix Chain Multiplication & Palindrome Partitioning: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_dp_interval_partition_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_interval_partition_sub3",
                    "subskillName": "Matrix Chain Multiplication & Palindrome Partitioning: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_dp_interval_partition_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_interval_partition_sub4",
                    "subskillName": "Matrix Chain Multiplication & Palindrome Partitioning: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_dp_interval_partition_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_interval_partition_sub5",
                    "subskillName": "Matrix Chain Multiplication & Palindrome Partitioning: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_dp_interval_partition_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_interval_partition_sub6",
                    "subskillName": "Matrix Chain Multiplication & Palindrome Partitioning: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_dp_interval_partition_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "dsa_sub_advanced_3",
            "name": "Bitmask Dynamic Programming & Core Concepts",
            "skills": [
              {
                "skillId": "dsa_dp_bitmask_tsp",
                "skillName": "Bitmask Dynamic Programming & Combinatorial Optimization",
                "prerequisites": [
                  "dsa_dp_knapsack_lcs"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_dp_bitmask_tsp_sub1",
                    "subskillName": "Bitmask Dynamic Programming & Combinatorial Optimization: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_bitmask_tsp_sub2",
                    "subskillName": "Bitmask Dynamic Programming & Combinatorial Optimization: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_dp_bitmask_tsp_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_bitmask_tsp_sub3",
                    "subskillName": "Bitmask Dynamic Programming & Combinatorial Optimization: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_dp_bitmask_tsp_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_bitmask_tsp_sub4",
                    "subskillName": "Bitmask Dynamic Programming & Combinatorial Optimization: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_dp_bitmask_tsp_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_bitmask_tsp_sub5",
                    "subskillName": "Bitmask Dynamic Programming & Combinatorial Optimization: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_dp_bitmask_tsp_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_dp_bitmask_tsp_sub6",
                    "subskillName": "Bitmask Dynamic Programming & Combinatorial Optimization: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_dp_bitmask_tsp_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_segment_trees_range_query",
                "skillName": "Segment Trees, Lazy Propagation & Range Queries",
                "prerequisites": [
                  "dsa_bst_operations"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_segment_trees_range_query_sub1",
                    "subskillName": "Segment Trees, Lazy Propagation & Range Queries: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_segment_trees_range_query_sub2",
                    "subskillName": "Segment Trees, Lazy Propagation & Range Queries: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_segment_trees_range_query_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_segment_trees_range_query_sub3",
                    "subskillName": "Segment Trees, Lazy Propagation & Range Queries: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_segment_trees_range_query_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_segment_trees_range_query_sub4",
                    "subskillName": "Segment Trees, Lazy Propagation & Range Queries: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_segment_trees_range_query_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_segment_trees_range_query_sub5",
                    "subskillName": "Segment Trees, Lazy Propagation & Range Queries: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_segment_trees_range_query_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_segment_trees_range_query_sub6",
                    "subskillName": "Segment Trees, Lazy Propagation & Range Queries: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_segment_trees_range_query_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_fenwick_binary_indexed_tree",
                "skillName": "Fenwick Tree / Binary Indexed Tree Prefix Sums",
                "prerequisites": [
                  "dsa_segment_trees_range_query"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_fenwick_binary_indexed_tree_sub1",
                    "subskillName": "Fenwick Tree / Binary Indexed Tree Prefix Sums: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_fenwick_binary_indexed_tree_sub2",
                    "subskillName": "Fenwick Tree / Binary Indexed Tree Prefix Sums: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_fenwick_binary_indexed_tree_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_fenwick_binary_indexed_tree_sub3",
                    "subskillName": "Fenwick Tree / Binary Indexed Tree Prefix Sums: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_fenwick_binary_indexed_tree_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_fenwick_binary_indexed_tree_sub4",
                    "subskillName": "Fenwick Tree / Binary Indexed Tree Prefix Sums: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_fenwick_binary_indexed_tree_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_fenwick_binary_indexed_tree_sub5",
                    "subskillName": "Fenwick Tree / Binary Indexed Tree Prefix Sums: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_fenwick_binary_indexed_tree_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_fenwick_binary_indexed_tree_sub6",
                    "subskillName": "Fenwick Tree / Binary Indexed Tree Prefix Sums: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_fenwick_binary_indexed_tree_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "dsa_advanced_string_kmp",
                "skillName": "KMP String Matching & Rabin-Karp Rolling Hash",
                "prerequisites": [
                  "dsa_dp_memo_tabulation"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "dsa_advanced_string_kmp_sub1",
                    "subskillName": "KMP String Matching & Rabin-Karp Rolling Hash: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_advanced_string_kmp_sub2",
                    "subskillName": "KMP String Matching & Rabin-Karp Rolling Hash: Component Structure & Memory",
                    "prerequisites": [
                      "dsa_advanced_string_kmp_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_advanced_string_kmp_sub3",
                    "subskillName": "KMP String Matching & Rabin-Karp Rolling Hash: Implementation Patterns & Flow",
                    "prerequisites": [
                      "dsa_advanced_string_kmp_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_advanced_string_kmp_sub4",
                    "subskillName": "KMP String Matching & Rabin-Karp Rolling Hash: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "dsa_advanced_string_kmp_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_advanced_string_kmp_sub5",
                    "subskillName": "KMP String Matching & Rabin-Karp Rolling Hash: Integration & Placement Questions",
                    "prerequisites": [
                      "dsa_advanced_string_kmp_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "dsa_advanced_string_kmp_sub6",
                    "subskillName": "KMP String Matching & Rabin-Karp Rolling Hash: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "dsa_advanced_string_kmp_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "mobile": {
    "domainId": "mobile",
    "domainName": "Mobile App Development (React Native & Flutter)",
    "topics": [
      {
        "id": "mobile_top_beginner",
        "name": "Mobile App Development (React Native & Flutter) — Beginner Tier",
        "subtopics": [
          {
            "id": "mobile_sub_beginner_1",
            "name": "JavaScript/Dart Mobile Syntax & Core Concepts",
            "skills": [
              {
                "skillId": "mob_lang_syntax",
                "skillName": "JavaScript/Dart Mobile Syntax",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_lang_syntax_sub1",
                    "subskillName": "JavaScript/Dart Mobile Syntax: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_lang_syntax_sub2",
                    "subskillName": "JavaScript/Dart Mobile Syntax: Component Structure & Memory",
                    "prerequisites": [
                      "mob_lang_syntax_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_lang_syntax_sub3",
                    "subskillName": "JavaScript/Dart Mobile Syntax: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_lang_syntax_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_lang_syntax_sub4",
                    "subskillName": "JavaScript/Dart Mobile Syntax: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_lang_syntax_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_lang_syntax_sub5",
                    "subskillName": "JavaScript/Dart Mobile Syntax: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_lang_syntax_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_lang_syntax_sub6",
                    "subskillName": "JavaScript/Dart Mobile Syntax: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_lang_syntax_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_async_dart_js",
                "skillName": "Asynchronous Programming in Mobile Apps",
                "prerequisites": [
                  "mob_lang_syntax"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_async_dart_js_sub1",
                    "subskillName": "Asynchronous Programming in Mobile Apps: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_async_dart_js_sub2",
                    "subskillName": "Asynchronous Programming in Mobile Apps: Component Structure & Memory",
                    "prerequisites": [
                      "mob_async_dart_js_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_async_dart_js_sub3",
                    "subskillName": "Asynchronous Programming in Mobile Apps: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_async_dart_js_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_async_dart_js_sub4",
                    "subskillName": "Asynchronous Programming in Mobile Apps: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_async_dart_js_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_async_dart_js_sub5",
                    "subskillName": "Asynchronous Programming in Mobile Apps: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_async_dart_js_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_async_dart_js_sub6",
                    "subskillName": "Asynchronous Programming in Mobile Apps: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_async_dart_js_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_flexbox_ui",
                "skillName": "Mobile Screen Layouts & Flexbox Engine",
                "prerequisites": [
                  "mob_lang_syntax"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_flexbox_ui_sub1",
                    "subskillName": "Mobile Screen Layouts & Flexbox Engine: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_flexbox_ui_sub2",
                    "subskillName": "Mobile Screen Layouts & Flexbox Engine: Component Structure & Memory",
                    "prerequisites": [
                      "mob_flexbox_ui_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_flexbox_ui_sub3",
                    "subskillName": "Mobile Screen Layouts & Flexbox Engine: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_flexbox_ui_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_flexbox_ui_sub4",
                    "subskillName": "Mobile Screen Layouts & Flexbox Engine: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_flexbox_ui_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_flexbox_ui_sub5",
                    "subskillName": "Mobile Screen Layouts & Flexbox Engine: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_flexbox_ui_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_flexbox_ui_sub6",
                    "subskillName": "Mobile Screen Layouts & Flexbox Engine: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_flexbox_ui_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_widgets_components",
                "skillName": "Reusable Custom Mobile UI Components",
                "prerequisites": [
                  "mob_flexbox_ui"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_widgets_components_sub1",
                    "subskillName": "Reusable Custom Mobile UI Components: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_widgets_components_sub2",
                    "subskillName": "Reusable Custom Mobile UI Components: Component Structure & Memory",
                    "prerequisites": [
                      "mob_widgets_components_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_widgets_components_sub3",
                    "subskillName": "Reusable Custom Mobile UI Components: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_widgets_components_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_widgets_components_sub4",
                    "subskillName": "Reusable Custom Mobile UI Components: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_widgets_components_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_widgets_components_sub5",
                    "subskillName": "Reusable Custom Mobile UI Components: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_widgets_components_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_widgets_components_sub6",
                    "subskillName": "Reusable Custom Mobile UI Components: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_widgets_components_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "mobile_sub_beginner_2",
            "name": "Mobile UI Principles, Safe Areas & Core Concepts",
            "skills": [
              {
                "skillId": "mob_ui_design_principles",
                "skillName": "Mobile UI Principles, Safe Areas & Platform Conventions",
                "prerequisites": [
                  "mob_flexbox_ui"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_ui_design_principles_sub1",
                    "subskillName": "Mobile UI Principles, Safe Areas & Platform Conventions: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ui_design_principles_sub2",
                    "subskillName": "Mobile UI Principles, Safe Areas & Platform Conventions: Component Structure & Memory",
                    "prerequisites": [
                      "mob_ui_design_principles_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ui_design_principles_sub3",
                    "subskillName": "Mobile UI Principles, Safe Areas & Platform Conventions: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_ui_design_principles_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ui_design_principles_sub4",
                    "subskillName": "Mobile UI Principles, Safe Areas & Platform Conventions: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_ui_design_principles_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ui_design_principles_sub5",
                    "subskillName": "Mobile UI Principles, Safe Areas & Platform Conventions: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_ui_design_principles_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ui_design_principles_sub6",
                    "subskillName": "Mobile UI Principles, Safe Areas & Platform Conventions: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_ui_design_principles_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_touch_inputs_buttons",
                "skillName": "Touch Inputs, Pressables & Gesture Responders",
                "prerequisites": [
                  "mob_widgets_components"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_touch_inputs_buttons_sub1",
                    "subskillName": "Touch Inputs, Pressables & Gesture Responders: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_touch_inputs_buttons_sub2",
                    "subskillName": "Touch Inputs, Pressables & Gesture Responders: Component Structure & Memory",
                    "prerequisites": [
                      "mob_touch_inputs_buttons_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_touch_inputs_buttons_sub3",
                    "subskillName": "Touch Inputs, Pressables & Gesture Responders: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_touch_inputs_buttons_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_touch_inputs_buttons_sub4",
                    "subskillName": "Touch Inputs, Pressables & Gesture Responders: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_touch_inputs_buttons_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_touch_inputs_buttons_sub5",
                    "subskillName": "Touch Inputs, Pressables & Gesture Responders: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_touch_inputs_buttons_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_touch_inputs_buttons_sub6",
                    "subskillName": "Touch Inputs, Pressables & Gesture Responders: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_touch_inputs_buttons_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_scrolling_lists",
                "skillName": "FlatList, ScrollView & Virtualized List Performance",
                "prerequisites": [
                  "mob_widgets_components"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_scrolling_lists_sub1",
                    "subskillName": "FlatList, ScrollView & Virtualized List Performance: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_scrolling_lists_sub2",
                    "subskillName": "FlatList, ScrollView & Virtualized List Performance: Component Structure & Memory",
                    "prerequisites": [
                      "mob_scrolling_lists_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_scrolling_lists_sub3",
                    "subskillName": "FlatList, ScrollView & Virtualized List Performance: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_scrolling_lists_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_scrolling_lists_sub4",
                    "subskillName": "FlatList, ScrollView & Virtualized List Performance: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_scrolling_lists_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_scrolling_lists_sub5",
                    "subskillName": "FlatList, ScrollView & Virtualized List Performance: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_scrolling_lists_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_scrolling_lists_sub6",
                    "subskillName": "FlatList, ScrollView & Virtualized List Performance: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_scrolling_lists_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_form_inputs_validation",
                "skillName": "TextInput Controls, Keyboard Avoidance & Validation",
                "prerequisites": [
                  "mob_touch_inputs_buttons"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_form_inputs_validation_sub1",
                    "subskillName": "TextInput Controls, Keyboard Avoidance & Validation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_form_inputs_validation_sub2",
                    "subskillName": "TextInput Controls, Keyboard Avoidance & Validation: Component Structure & Memory",
                    "prerequisites": [
                      "mob_form_inputs_validation_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_form_inputs_validation_sub3",
                    "subskillName": "TextInput Controls, Keyboard Avoidance & Validation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_form_inputs_validation_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_form_inputs_validation_sub4",
                    "subskillName": "TextInput Controls, Keyboard Avoidance & Validation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_form_inputs_validation_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_form_inputs_validation_sub5",
                    "subskillName": "TextInput Controls, Keyboard Avoidance & Validation: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_form_inputs_validation_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_form_inputs_validation_sub6",
                    "subskillName": "TextInput Controls, Keyboard Avoidance & Validation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_form_inputs_validation_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "mobile_sub_beginner_3",
            "name": "Image Caching, Vector Icons & Core Concepts",
            "skills": [
              {
                "skillId": "mob_images_asset_bundling",
                "skillName": "Image Caching, Vector Icons & Asset Bundles",
                "prerequisites": [
                  "mob_widgets_components"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_images_asset_bundling_sub1",
                    "subskillName": "Image Caching, Vector Icons & Asset Bundles: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_images_asset_bundling_sub2",
                    "subskillName": "Image Caching, Vector Icons & Asset Bundles: Component Structure & Memory",
                    "prerequisites": [
                      "mob_images_asset_bundling_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_images_asset_bundling_sub3",
                    "subskillName": "Image Caching, Vector Icons & Asset Bundles: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_images_asset_bundling_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_images_asset_bundling_sub4",
                    "subskillName": "Image Caching, Vector Icons & Asset Bundles: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_images_asset_bundling_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_images_asset_bundling_sub5",
                    "subskillName": "Image Caching, Vector Icons & Asset Bundles: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_images_asset_bundling_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_images_asset_bundling_sub6",
                    "subskillName": "Image Caching, Vector Icons & Asset Bundles: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_images_asset_bundling_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_device_orientation_responsive",
                "skillName": "Responsive Layouts & Screen Orientation Handling",
                "prerequisites": [
                  "mob_flexbox_ui"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_device_orientation_responsive_sub1",
                    "subskillName": "Responsive Layouts & Screen Orientation Handling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_device_orientation_responsive_sub2",
                    "subskillName": "Responsive Layouts & Screen Orientation Handling: Component Structure & Memory",
                    "prerequisites": [
                      "mob_device_orientation_responsive_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_device_orientation_responsive_sub3",
                    "subskillName": "Responsive Layouts & Screen Orientation Handling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_device_orientation_responsive_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_device_orientation_responsive_sub4",
                    "subskillName": "Responsive Layouts & Screen Orientation Handling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_device_orientation_responsive_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_device_orientation_responsive_sub5",
                    "subskillName": "Responsive Layouts & Screen Orientation Handling: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_device_orientation_responsive_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_device_orientation_responsive_sub6",
                    "subskillName": "Responsive Layouts & Screen Orientation Handling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_device_orientation_responsive_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_local_state_hooks",
                "skillName": "Local Component State & Hook Lifecycles",
                "prerequisites": [
                  "mob_widgets_components"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_local_state_hooks_sub1",
                    "subskillName": "Local Component State & Hook Lifecycles: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_state_hooks_sub2",
                    "subskillName": "Local Component State & Hook Lifecycles: Component Structure & Memory",
                    "prerequisites": [
                      "mob_local_state_hooks_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_state_hooks_sub3",
                    "subskillName": "Local Component State & Hook Lifecycles: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_local_state_hooks_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_state_hooks_sub4",
                    "subskillName": "Local Component State & Hook Lifecycles: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_local_state_hooks_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_state_hooks_sub5",
                    "subskillName": "Local Component State & Hook Lifecycles: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_local_state_hooks_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_state_hooks_sub6",
                    "subskillName": "Local Component State & Hook Lifecycles: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_local_state_hooks_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_theme_dark_mode",
                "skillName": "Light & Dark Theme Switching with Dynamic Styling",
                "prerequisites": [
                  "mob_local_state_hooks"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "mob_theme_dark_mode_sub1",
                    "subskillName": "Light & Dark Theme Switching with Dynamic Styling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_theme_dark_mode_sub2",
                    "subskillName": "Light & Dark Theme Switching with Dynamic Styling: Component Structure & Memory",
                    "prerequisites": [
                      "mob_theme_dark_mode_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_theme_dark_mode_sub3",
                    "subskillName": "Light & Dark Theme Switching with Dynamic Styling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_theme_dark_mode_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_theme_dark_mode_sub4",
                    "subskillName": "Light & Dark Theme Switching with Dynamic Styling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_theme_dark_mode_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_theme_dark_mode_sub5",
                    "subskillName": "Light & Dark Theme Switching with Dynamic Styling: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_theme_dark_mode_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_theme_dark_mode_sub6",
                    "subskillName": "Light & Dark Theme Switching with Dynamic Styling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_theme_dark_mode_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "mobile_top_intermediate",
        "name": "Mobile App Development (React Native & Flutter) — Intermediate Tier",
        "subtopics": [
          {
            "id": "mobile_sub_intermediate_1",
            "name": "Redux / Provider / Context State Management & Core Concepts",
            "skills": [
              {
                "skillId": "mob_state_management",
                "skillName": "Redux / Provider / Context State Management",
                "prerequisites": [
                  "mob_widgets_components"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_state_management_sub1",
                    "subskillName": "Redux / Provider / Context State Management: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_state_management_sub2",
                    "subskillName": "Redux / Provider / Context State Management: Component Structure & Memory",
                    "prerequisites": [
                      "mob_state_management_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_state_management_sub3",
                    "subskillName": "Redux / Provider / Context State Management: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_state_management_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_state_management_sub4",
                    "subskillName": "Redux / Provider / Context State Management: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_state_management_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_state_management_sub5",
                    "subskillName": "Redux / Provider / Context State Management: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_state_management_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_state_management_sub6",
                    "subskillName": "Redux / Provider / Context State Management: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_state_management_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_navigation_routing",
                "skillName": "Stack, Tab & Deep Link Navigation",
                "prerequisites": [
                  "mob_state_management"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_navigation_routing_sub1",
                    "subskillName": "Stack, Tab & Deep Link Navigation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_navigation_routing_sub2",
                    "subskillName": "Stack, Tab & Deep Link Navigation: Component Structure & Memory",
                    "prerequisites": [
                      "mob_navigation_routing_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_navigation_routing_sub3",
                    "subskillName": "Stack, Tab & Deep Link Navigation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_navigation_routing_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_navigation_routing_sub4",
                    "subskillName": "Stack, Tab & Deep Link Navigation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_navigation_routing_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_navigation_routing_sub5",
                    "subskillName": "Stack, Tab & Deep Link Navigation: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_navigation_routing_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_navigation_routing_sub6",
                    "subskillName": "Stack, Tab & Deep Link Navigation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_navigation_routing_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_camera_location_api",
                "skillName": "Camera & Geolocation Device APIs",
                "prerequisites": [
                  "mob_navigation_routing"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_camera_location_api_sub1",
                    "subskillName": "Camera & Geolocation Device APIs: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_camera_location_api_sub2",
                    "subskillName": "Camera & Geolocation Device APIs: Component Structure & Memory",
                    "prerequisites": [
                      "mob_camera_location_api_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_camera_location_api_sub3",
                    "subskillName": "Camera & Geolocation Device APIs: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_camera_location_api_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_camera_location_api_sub4",
                    "subskillName": "Camera & Geolocation Device APIs: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_camera_location_api_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_camera_location_api_sub5",
                    "subskillName": "Camera & Geolocation Device APIs: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_camera_location_api_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_camera_location_api_sub6",
                    "subskillName": "Camera & Geolocation Device APIs: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_camera_location_api_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_push_notifications",
                "skillName": "Firebase Cloud Messaging (FCM) & Push Alerts",
                "prerequisites": [
                  "mob_camera_location_api"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_push_notifications_sub1",
                    "subskillName": "Firebase Cloud Messaging (FCM) & Push Alerts: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_push_notifications_sub2",
                    "subskillName": "Firebase Cloud Messaging (FCM) & Push Alerts: Component Structure & Memory",
                    "prerequisites": [
                      "mob_push_notifications_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_push_notifications_sub3",
                    "subskillName": "Firebase Cloud Messaging (FCM) & Push Alerts: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_push_notifications_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_push_notifications_sub4",
                    "subskillName": "Firebase Cloud Messaging (FCM) & Push Alerts: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_push_notifications_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_push_notifications_sub5",
                    "subskillName": "Firebase Cloud Messaging (FCM) & Push Alerts: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_push_notifications_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_push_notifications_sub6",
                    "subskillName": "Firebase Cloud Messaging (FCM) & Push Alerts: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_push_notifications_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "mobile_sub_intermediate_2",
            "name": "AsyncStorage & Core Concepts",
            "skills": [
              {
                "skillId": "mob_local_db_storage",
                "skillName": "AsyncStorage & SQLite Local Databases",
                "prerequisites": [
                  "mob_push_notifications"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_local_db_storage_sub1",
                    "subskillName": "AsyncStorage & SQLite Local Databases: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_db_storage_sub2",
                    "subskillName": "AsyncStorage & SQLite Local Databases: Component Structure & Memory",
                    "prerequisites": [
                      "mob_local_db_storage_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_db_storage_sub3",
                    "subskillName": "AsyncStorage & SQLite Local Databases: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_local_db_storage_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_db_storage_sub4",
                    "subskillName": "AsyncStorage & SQLite Local Databases: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_local_db_storage_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_db_storage_sub5",
                    "subskillName": "AsyncStorage & SQLite Local Databases: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_local_db_storage_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_local_db_storage_sub6",
                    "subskillName": "AsyncStorage & SQLite Local Databases: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_local_db_storage_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_network_rest_http",
                "skillName": "Networking, Axios/HTTP Client & API Error Handling",
                "prerequisites": [
                  "mob_state_management"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_network_rest_http_sub1",
                    "subskillName": "Networking, Axios/HTTP Client & API Error Handling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_network_rest_http_sub2",
                    "subskillName": "Networking, Axios/HTTP Client & API Error Handling: Component Structure & Memory",
                    "prerequisites": [
                      "mob_network_rest_http_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_network_rest_http_sub3",
                    "subskillName": "Networking, Axios/HTTP Client & API Error Handling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_network_rest_http_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_network_rest_http_sub4",
                    "subskillName": "Networking, Axios/HTTP Client & API Error Handling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_network_rest_http_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_network_rest_http_sub5",
                    "subskillName": "Networking, Axios/HTTP Client & API Error Handling: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_network_rest_http_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_network_rest_http_sub6",
                    "subskillName": "Networking, Axios/HTTP Client & API Error Handling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_network_rest_http_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_sqlite_room_offline",
                "skillName": "SQLite / Room Embedded Database & Local CRUD",
                "prerequisites": [
                  "mob_local_db_storage"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_sqlite_room_offline_sub1",
                    "subskillName": "SQLite / Room Embedded Database & Local CRUD: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_sqlite_room_offline_sub2",
                    "subskillName": "SQLite / Room Embedded Database & Local CRUD: Component Structure & Memory",
                    "prerequisites": [
                      "mob_sqlite_room_offline_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_sqlite_room_offline_sub3",
                    "subskillName": "SQLite / Room Embedded Database & Local CRUD: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_sqlite_room_offline_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_sqlite_room_offline_sub4",
                    "subskillName": "SQLite / Room Embedded Database & Local CRUD: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_sqlite_room_offline_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_sqlite_room_offline_sub5",
                    "subskillName": "SQLite / Room Embedded Database & Local CRUD: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_sqlite_room_offline_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_sqlite_room_offline_sub6",
                    "subskillName": "SQLite / Room Embedded Database & Local CRUD: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_sqlite_room_offline_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_redux_toolkit_bloc",
                "skillName": "Global State Architecture: Redux Toolkit & Bloc Pattern",
                "prerequisites": [
                  "mob_state_management"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_redux_toolkit_bloc_sub1",
                    "subskillName": "Global State Architecture: Redux Toolkit & Bloc Pattern: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_redux_toolkit_bloc_sub2",
                    "subskillName": "Global State Architecture: Redux Toolkit & Bloc Pattern: Component Structure & Memory",
                    "prerequisites": [
                      "mob_redux_toolkit_bloc_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_redux_toolkit_bloc_sub3",
                    "subskillName": "Global State Architecture: Redux Toolkit & Bloc Pattern: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_redux_toolkit_bloc_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_redux_toolkit_bloc_sub4",
                    "subskillName": "Global State Architecture: Redux Toolkit & Bloc Pattern: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_redux_toolkit_bloc_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_redux_toolkit_bloc_sub5",
                    "subskillName": "Global State Architecture: Redux Toolkit & Bloc Pattern: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_redux_toolkit_bloc_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_redux_toolkit_bloc_sub6",
                    "subskillName": "Global State Architecture: Redux Toolkit & Bloc Pattern: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_redux_toolkit_bloc_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "mobile_sub_intermediate_3",
            "name": "Universal Links & Core Concepts",
            "skills": [
              {
                "skillId": "mob_deep_linking_routing",
                "skillName": "Universal Links & Deep Linking Navigation Architecture",
                "prerequisites": [
                  "mob_navigation_routing"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_deep_linking_routing_sub1",
                    "subskillName": "Universal Links & Deep Linking Navigation Architecture: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_deep_linking_routing_sub2",
                    "subskillName": "Universal Links & Deep Linking Navigation Architecture: Component Structure & Memory",
                    "prerequisites": [
                      "mob_deep_linking_routing_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_deep_linking_routing_sub3",
                    "subskillName": "Universal Links & Deep Linking Navigation Architecture: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_deep_linking_routing_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_deep_linking_routing_sub4",
                    "subskillName": "Universal Links & Deep Linking Navigation Architecture: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_deep_linking_routing_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_deep_linking_routing_sub5",
                    "subskillName": "Universal Links & Deep Linking Navigation Architecture: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_deep_linking_routing_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_deep_linking_routing_sub6",
                    "subskillName": "Universal Links & Deep Linking Navigation Architecture: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_deep_linking_routing_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_animations_reanimated",
                "skillName": "Fluid Animations with React Native Reanimated & Gestures",
                "prerequisites": [
                  "mob_navigation_routing"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_animations_reanimated_sub1",
                    "subskillName": "Fluid Animations with React Native Reanimated & Gestures: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_animations_reanimated_sub2",
                    "subskillName": "Fluid Animations with React Native Reanimated & Gestures: Component Structure & Memory",
                    "prerequisites": [
                      "mob_animations_reanimated_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_animations_reanimated_sub3",
                    "subskillName": "Fluid Animations with React Native Reanimated & Gestures: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_animations_reanimated_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_animations_reanimated_sub4",
                    "subskillName": "Fluid Animations with React Native Reanimated & Gestures: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_animations_reanimated_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_animations_reanimated_sub5",
                    "subskillName": "Fluid Animations with React Native Reanimated & Gestures: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_animations_reanimated_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_animations_reanimated_sub6",
                    "subskillName": "Fluid Animations with React Native Reanimated & Gestures: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_animations_reanimated_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_biometric_hardware_auth",
                "skillName": "Biometric Fingerprint & FaceID Authentication",
                "prerequisites": [
                  "mob_camera_location_api"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_biometric_hardware_auth_sub1",
                    "subskillName": "Biometric Fingerprint & FaceID Authentication: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_hardware_auth_sub2",
                    "subskillName": "Biometric Fingerprint & FaceID Authentication: Component Structure & Memory",
                    "prerequisites": [
                      "mob_biometric_hardware_auth_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_hardware_auth_sub3",
                    "subskillName": "Biometric Fingerprint & FaceID Authentication: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_biometric_hardware_auth_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_hardware_auth_sub4",
                    "subskillName": "Biometric Fingerprint & FaceID Authentication: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_biometric_hardware_auth_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_hardware_auth_sub5",
                    "subskillName": "Biometric Fingerprint & FaceID Authentication: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_biometric_hardware_auth_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_hardware_auth_sub6",
                    "subskillName": "Biometric Fingerprint & FaceID Authentication: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_biometric_hardware_auth_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_offline_sync_architecture",
                "skillName": "Offline-First Architecture & Network Sync Queue",
                "prerequisites": [
                  "mob_local_db_storage"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "mob_offline_sync_architecture_sub1",
                    "subskillName": "Offline-First Architecture & Network Sync Queue: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_offline_sync_architecture_sub2",
                    "subskillName": "Offline-First Architecture & Network Sync Queue: Component Structure & Memory",
                    "prerequisites": [
                      "mob_offline_sync_architecture_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_offline_sync_architecture_sub3",
                    "subskillName": "Offline-First Architecture & Network Sync Queue: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_offline_sync_architecture_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_offline_sync_architecture_sub4",
                    "subskillName": "Offline-First Architecture & Network Sync Queue: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_offline_sync_architecture_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_offline_sync_architecture_sub5",
                    "subskillName": "Offline-First Architecture & Network Sync Queue: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_offline_sync_architecture_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_offline_sync_architecture_sub6",
                    "subskillName": "Offline-First Architecture & Network Sync Queue: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_offline_sync_architecture_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "mobile_top_advanced",
        "name": "Mobile App Development (React Native & Flutter) — Advanced Tier",
        "subtopics": [
          {
            "id": "mobile_sub_advanced_1",
            "name": "FPS Optimization & Core Concepts",
            "skills": [
              {
                "skillId": "mob_perf_profiling",
                "skillName": "FPS Optimization & Memory Leak Profiling",
                "prerequisites": [
                  "mob_local_db_storage"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_perf_profiling_sub1",
                    "subskillName": "FPS Optimization & Memory Leak Profiling: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_perf_profiling_sub2",
                    "subskillName": "FPS Optimization & Memory Leak Profiling: Component Structure & Memory",
                    "prerequisites": [
                      "mob_perf_profiling_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_perf_profiling_sub3",
                    "subskillName": "FPS Optimization & Memory Leak Profiling: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_perf_profiling_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_perf_profiling_sub4",
                    "subskillName": "FPS Optimization & Memory Leak Profiling: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_perf_profiling_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_perf_profiling_sub5",
                    "subskillName": "FPS Optimization & Memory Leak Profiling: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_perf_profiling_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_perf_profiling_sub6",
                    "subskillName": "FPS Optimization & Memory Leak Profiling: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_perf_profiling_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_oauth_keychain",
                "skillName": "OAuth 2.0 & Secure Keychain Storage",
                "prerequisites": [
                  "mob_perf_profiling"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_oauth_keychain_sub1",
                    "subskillName": "OAuth 2.0 & Secure Keychain Storage: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_oauth_keychain_sub2",
                    "subskillName": "OAuth 2.0 & Secure Keychain Storage: Component Structure & Memory",
                    "prerequisites": [
                      "mob_oauth_keychain_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_oauth_keychain_sub3",
                    "subskillName": "OAuth 2.0 & Secure Keychain Storage: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_oauth_keychain_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_oauth_keychain_sub4",
                    "subskillName": "OAuth 2.0 & Secure Keychain Storage: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_oauth_keychain_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_oauth_keychain_sub5",
                    "subskillName": "OAuth 2.0 & Secure Keychain Storage: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_oauth_keychain_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_oauth_keychain_sub6",
                    "subskillName": "OAuth 2.0 & Secure Keychain Storage: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_oauth_keychain_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_biometric_auth",
                "skillName": "Biometric Auth & SSL Pinning Security",
                "prerequisites": [
                  "mob_oauth_keychain"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_biometric_auth_sub1",
                    "subskillName": "Biometric Auth & SSL Pinning Security: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_auth_sub2",
                    "subskillName": "Biometric Auth & SSL Pinning Security: Component Structure & Memory",
                    "prerequisites": [
                      "mob_biometric_auth_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_auth_sub3",
                    "subskillName": "Biometric Auth & SSL Pinning Security: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_biometric_auth_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_auth_sub4",
                    "subskillName": "Biometric Auth & SSL Pinning Security: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_biometric_auth_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_auth_sub5",
                    "subskillName": "Biometric Auth & SSL Pinning Security: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_biometric_auth_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_biometric_auth_sub6",
                    "subskillName": "Biometric Auth & SSL Pinning Security: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_biometric_auth_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_fastlane_signing",
                "skillName": "Fastlane Automation & Code Signing",
                "prerequisites": [
                  "mob_biometric_auth"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_fastlane_signing_sub1",
                    "subskillName": "Fastlane Automation & Code Signing: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_fastlane_signing_sub2",
                    "subskillName": "Fastlane Automation & Code Signing: Component Structure & Memory",
                    "prerequisites": [
                      "mob_fastlane_signing_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_fastlane_signing_sub3",
                    "subskillName": "Fastlane Automation & Code Signing: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_fastlane_signing_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_fastlane_signing_sub4",
                    "subskillName": "Fastlane Automation & Code Signing: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_fastlane_signing_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_fastlane_signing_sub5",
                    "subskillName": "Fastlane Automation & Code Signing: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_fastlane_signing_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_fastlane_signing_sub6",
                    "subskillName": "Fastlane Automation & Code Signing: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_fastlane_signing_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "mobile_sub_advanced_2",
            "name": "App Store & Core Concepts",
            "skills": [
              {
                "skillId": "mob_store_submission_capstone",
                "skillName": "App Store & Play Store Submission Capstone",
                "prerequisites": [
                  "mob_fastlane_signing"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_store_submission_capstone_sub1",
                    "subskillName": "App Store & Play Store Submission Capstone: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_store_submission_capstone_sub2",
                    "subskillName": "App Store & Play Store Submission Capstone: Component Structure & Memory",
                    "prerequisites": [
                      "mob_store_submission_capstone_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_store_submission_capstone_sub3",
                    "subskillName": "App Store & Play Store Submission Capstone: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_store_submission_capstone_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_store_submission_capstone_sub4",
                    "subskillName": "App Store & Play Store Submission Capstone: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_store_submission_capstone_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_store_submission_capstone_sub5",
                    "subskillName": "App Store & Play Store Submission Capstone: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_store_submission_capstone_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_store_submission_capstone_sub6",
                    "subskillName": "App Store & Play Store Submission Capstone: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_store_submission_capstone_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_native_modules_cxx",
                "skillName": "Native Modules, TurboModules & JSI C++ Bridge Integration",
                "prerequisites": [
                  "mob_perf_profiling"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_native_modules_cxx_sub1",
                    "subskillName": "Native Modules, TurboModules & JSI C++ Bridge Integration: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_native_modules_cxx_sub2",
                    "subskillName": "Native Modules, TurboModules & JSI C++ Bridge Integration: Component Structure & Memory",
                    "prerequisites": [
                      "mob_native_modules_cxx_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_native_modules_cxx_sub3",
                    "subskillName": "Native Modules, TurboModules & JSI C++ Bridge Integration: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_native_modules_cxx_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_native_modules_cxx_sub4",
                    "subskillName": "Native Modules, TurboModules & JSI C++ Bridge Integration: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_native_modules_cxx_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_native_modules_cxx_sub5",
                    "subskillName": "Native Modules, TurboModules & JSI C++ Bridge Integration: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_native_modules_cxx_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_native_modules_cxx_sub6",
                    "subskillName": "Native Modules, TurboModules & JSI C++ Bridge Integration: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_native_modules_cxx_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_memory_leak_profiling",
                "skillName": "Memory Leak Profiling with Android Studio & Xcode",
                "prerequisites": [
                  "mob_perf_profiling"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_memory_leak_profiling_sub1",
                    "subskillName": "Memory Leak Profiling with Android Studio & Xcode: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_memory_leak_profiling_sub2",
                    "subskillName": "Memory Leak Profiling with Android Studio & Xcode: Component Structure & Memory",
                    "prerequisites": [
                      "mob_memory_leak_profiling_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_memory_leak_profiling_sub3",
                    "subskillName": "Memory Leak Profiling with Android Studio & Xcode: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_memory_leak_profiling_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_memory_leak_profiling_sub4",
                    "subskillName": "Memory Leak Profiling with Android Studio & Xcode: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_memory_leak_profiling_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_memory_leak_profiling_sub5",
                    "subskillName": "Memory Leak Profiling with Android Studio & Xcode: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_memory_leak_profiling_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_memory_leak_profiling_sub6",
                    "subskillName": "Memory Leak Profiling with Android Studio & Xcode: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_memory_leak_profiling_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_code_push_ota",
                "skillName": "Over-The-Air (OTA) Updates & Hot-Patching Workflows",
                "prerequisites": [
                  "mob_fastlane_signing"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_code_push_ota_sub1",
                    "subskillName": "Over-The-Air (OTA) Updates & Hot-Patching Workflows: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_code_push_ota_sub2",
                    "subskillName": "Over-The-Air (OTA) Updates & Hot-Patching Workflows: Component Structure & Memory",
                    "prerequisites": [
                      "mob_code_push_ota_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_code_push_ota_sub3",
                    "subskillName": "Over-The-Air (OTA) Updates & Hot-Patching Workflows: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_code_push_ota_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_code_push_ota_sub4",
                    "subskillName": "Over-The-Air (OTA) Updates & Hot-Patching Workflows: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_code_push_ota_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_code_push_ota_sub5",
                    "subskillName": "Over-The-Air (OTA) Updates & Hot-Patching Workflows: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_code_push_ota_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_code_push_ota_sub6",
                    "subskillName": "Over-The-Air (OTA) Updates & Hot-Patching Workflows: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_code_push_ota_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "mobile_sub_advanced_3",
            "name": "Mobile App Security, SSL Pinning & Core Concepts",
            "skills": [
              {
                "skillId": "mob_security_ssl_pinning",
                "skillName": "Mobile App Security, SSL Pinning & Keystore Hardening",
                "prerequisites": [
                  "mob_biometric_auth"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_security_ssl_pinning_sub1",
                    "subskillName": "Mobile App Security, SSL Pinning & Keystore Hardening: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_security_ssl_pinning_sub2",
                    "subskillName": "Mobile App Security, SSL Pinning & Keystore Hardening: Component Structure & Memory",
                    "prerequisites": [
                      "mob_security_ssl_pinning_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_security_ssl_pinning_sub3",
                    "subskillName": "Mobile App Security, SSL Pinning & Keystore Hardening: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_security_ssl_pinning_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_security_ssl_pinning_sub4",
                    "subskillName": "Mobile App Security, SSL Pinning & Keystore Hardening: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_security_ssl_pinning_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_security_ssl_pinning_sub5",
                    "subskillName": "Mobile App Security, SSL Pinning & Keystore Hardening: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_security_ssl_pinning_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_security_ssl_pinning_sub6",
                    "subskillName": "Mobile App Security, SSL Pinning & Keystore Hardening: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_security_ssl_pinning_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_webrtc_audio_video",
                "skillName": "WebRTC Real-Time Audio & Video Streaming Engine",
                "prerequisites": [
                  "mob_perf_profiling"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_webrtc_audio_video_sub1",
                    "subskillName": "WebRTC Real-Time Audio & Video Streaming Engine: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_webrtc_audio_video_sub2",
                    "subskillName": "WebRTC Real-Time Audio & Video Streaming Engine: Component Structure & Memory",
                    "prerequisites": [
                      "mob_webrtc_audio_video_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_webrtc_audio_video_sub3",
                    "subskillName": "WebRTC Real-Time Audio & Video Streaming Engine: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_webrtc_audio_video_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_webrtc_audio_video_sub4",
                    "subskillName": "WebRTC Real-Time Audio & Video Streaming Engine: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_webrtc_audio_video_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_webrtc_audio_video_sub5",
                    "subskillName": "WebRTC Real-Time Audio & Video Streaming Engine: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_webrtc_audio_video_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_webrtc_audio_video_sub6",
                    "subskillName": "WebRTC Real-Time Audio & Video Streaming Engine: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_webrtc_audio_video_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_ci_cd_fastlane_github",
                "skillName": "Automated Build & Test CI/CD Pipelines with Fastlane",
                "prerequisites": [
                  "mob_fastlane_signing"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_ci_cd_fastlane_github_sub1",
                    "subskillName": "Automated Build & Test CI/CD Pipelines with Fastlane: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ci_cd_fastlane_github_sub2",
                    "subskillName": "Automated Build & Test CI/CD Pipelines with Fastlane: Component Structure & Memory",
                    "prerequisites": [
                      "mob_ci_cd_fastlane_github_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ci_cd_fastlane_github_sub3",
                    "subskillName": "Automated Build & Test CI/CD Pipelines with Fastlane: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_ci_cd_fastlane_github_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ci_cd_fastlane_github_sub4",
                    "subskillName": "Automated Build & Test CI/CD Pipelines with Fastlane: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_ci_cd_fastlane_github_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ci_cd_fastlane_github_sub5",
                    "subskillName": "Automated Build & Test CI/CD Pipelines with Fastlane: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_ci_cd_fastlane_github_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_ci_cd_fastlane_github_sub6",
                    "subskillName": "Automated Build & Test CI/CD Pipelines with Fastlane: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_ci_cd_fastlane_github_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "mob_app_store_play_store_deployment",
                "skillName": "Google Play & Apple App Store Release Management",
                "prerequisites": [
                  "mob_store_submission_capstone"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "mob_app_store_play_store_deployment_sub1",
                    "subskillName": "Google Play & Apple App Store Release Management: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_app_store_play_store_deployment_sub2",
                    "subskillName": "Google Play & Apple App Store Release Management: Component Structure & Memory",
                    "prerequisites": [
                      "mob_app_store_play_store_deployment_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_app_store_play_store_deployment_sub3",
                    "subskillName": "Google Play & Apple App Store Release Management: Implementation Patterns & Flow",
                    "prerequisites": [
                      "mob_app_store_play_store_deployment_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_app_store_play_store_deployment_sub4",
                    "subskillName": "Google Play & Apple App Store Release Management: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "mob_app_store_play_store_deployment_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_app_store_play_store_deployment_sub5",
                    "subskillName": "Google Play & Apple App Store Release Management: Integration & Placement Questions",
                    "prerequisites": [
                      "mob_app_store_play_store_deployment_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "mob_app_store_play_store_deployment_sub6",
                    "subskillName": "Google Play & Apple App Store Release Management: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "mob_app_store_play_store_deployment_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "ai_llm": {
    "domainId": "ai_llm",
    "domainName": "AI & LLM Systems Engineering",
    "topics": [
      {
        "id": "ai_llm_top_beginner",
        "name": "AI & LLM Systems Engineering — Beginner Tier",
        "subtopics": [
          {
            "id": "ai_llm_sub_beginner_1",
            "name": "Linear Algebra, Matrices & Core Concepts",
            "skills": [
              {
                "skillId": "ai_math_vectors",
                "skillName": "Linear Algebra, Matrices & Vector Math",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_math_vectors_sub1",
                    "subskillName": "Linear Algebra, Matrices & Vector Math: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_math_vectors_sub2",
                    "subskillName": "Linear Algebra, Matrices & Vector Math: Component Structure & Memory",
                    "prerequisites": [
                      "ai_math_vectors_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_math_vectors_sub3",
                    "subskillName": "Linear Algebra, Matrices & Vector Math: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_math_vectors_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_math_vectors_sub4",
                    "subskillName": "Linear Algebra, Matrices & Vector Math: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_math_vectors_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_math_vectors_sub5",
                    "subskillName": "Linear Algebra, Matrices & Vector Math: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_math_vectors_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_math_vectors_sub6",
                    "subskillName": "Linear Algebra, Matrices & Vector Math: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_math_vectors_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_python_apis",
                "skillName": "Python LLM SDKs & API Requests",
                "prerequisites": [
                  "ai_math_vectors"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_python_apis_sub1",
                    "subskillName": "Python LLM SDKs & API Requests: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_python_apis_sub2",
                    "subskillName": "Python LLM SDKs & API Requests: Component Structure & Memory",
                    "prerequisites": [
                      "ai_python_apis_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_python_apis_sub3",
                    "subskillName": "Python LLM SDKs & API Requests: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_python_apis_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_python_apis_sub4",
                    "subskillName": "Python LLM SDKs & API Requests: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_python_apis_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_python_apis_sub5",
                    "subskillName": "Python LLM SDKs & API Requests: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_python_apis_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_python_apis_sub6",
                    "subskillName": "Python LLM SDKs & API Requests: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_python_apis_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_prompt_design",
                "skillName": "System Prompts & Context Window Allocation",
                "prerequisites": [
                  "ai_python_apis"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_prompt_design_sub1",
                    "subskillName": "System Prompts & Context Window Allocation: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_prompt_design_sub2",
                    "subskillName": "System Prompts & Context Window Allocation: Component Structure & Memory",
                    "prerequisites": [
                      "ai_prompt_design_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_prompt_design_sub3",
                    "subskillName": "System Prompts & Context Window Allocation: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_prompt_design_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_prompt_design_sub4",
                    "subskillName": "System Prompts & Context Window Allocation: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_prompt_design_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_prompt_design_sub5",
                    "subskillName": "System Prompts & Context Window Allocation: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_prompt_design_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_prompt_design_sub6",
                    "subskillName": "System Prompts & Context Window Allocation: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_prompt_design_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_structured_json",
                "skillName": "Structured JSON Schemas & Output Parsing",
                "prerequisites": [
                  "ai_prompt_design"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_structured_json_sub1",
                    "subskillName": "Structured JSON Schemas & Output Parsing: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_structured_json_sub2",
                    "subskillName": "Structured JSON Schemas & Output Parsing: Component Structure & Memory",
                    "prerequisites": [
                      "ai_structured_json_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_structured_json_sub3",
                    "subskillName": "Structured JSON Schemas & Output Parsing: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_structured_json_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_structured_json_sub4",
                    "subskillName": "Structured JSON Schemas & Output Parsing: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_structured_json_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_structured_json_sub5",
                    "subskillName": "Structured JSON Schemas & Output Parsing: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_structured_json_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_structured_json_sub6",
                    "subskillName": "Structured JSON Schemas & Output Parsing: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_structured_json_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "ai_llm_sub_beginner_2",
            "name": "Matrix Multiplications, Dot Products & Core Concepts",
            "skills": [
              {
                "skillId": "ai_linear_algebra_matrices",
                "skillName": "Matrix Multiplications, Dot Products & Cosine Similarity",
                "prerequisites": [
                  "ai_math_vectors"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_linear_algebra_matrices_sub1",
                    "subskillName": "Matrix Multiplications, Dot Products & Cosine Similarity: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_linear_algebra_matrices_sub2",
                    "subskillName": "Matrix Multiplications, Dot Products & Cosine Similarity: Component Structure & Memory",
                    "prerequisites": [
                      "ai_linear_algebra_matrices_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_linear_algebra_matrices_sub3",
                    "subskillName": "Matrix Multiplications, Dot Products & Cosine Similarity: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_linear_algebra_matrices_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_linear_algebra_matrices_sub4",
                    "subskillName": "Matrix Multiplications, Dot Products & Cosine Similarity: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_linear_algebra_matrices_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_linear_algebra_matrices_sub5",
                    "subskillName": "Matrix Multiplications, Dot Products & Cosine Similarity: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_linear_algebra_matrices_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_linear_algebra_matrices_sub6",
                    "subskillName": "Matrix Multiplications, Dot Products & Cosine Similarity: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_linear_algebra_matrices_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_probability_distributions",
                "skillName": "Probability Distributions & Softmax Mechanics",
                "prerequisites": [
                  "ai_math_vectors"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_probability_distributions_sub1",
                    "subskillName": "Probability Distributions & Softmax Mechanics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_probability_distributions_sub2",
                    "subskillName": "Probability Distributions & Softmax Mechanics: Component Structure & Memory",
                    "prerequisites": [
                      "ai_probability_distributions_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_probability_distributions_sub3",
                    "subskillName": "Probability Distributions & Softmax Mechanics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_probability_distributions_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_probability_distributions_sub4",
                    "subskillName": "Probability Distributions & Softmax Mechanics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_probability_distributions_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_probability_distributions_sub5",
                    "subskillName": "Probability Distributions & Softmax Mechanics: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_probability_distributions_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_probability_distributions_sub6",
                    "subskillName": "Probability Distributions & Softmax Mechanics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_probability_distributions_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_tokenization_bpe",
                "skillName": "Text Tokenization, Byte-Pair Encoding & Vocabularies",
                "prerequisites": [
                  "ai_python_apis"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_tokenization_bpe_sub1",
                    "subskillName": "Text Tokenization, Byte-Pair Encoding & Vocabularies: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tokenization_bpe_sub2",
                    "subskillName": "Text Tokenization, Byte-Pair Encoding & Vocabularies: Component Structure & Memory",
                    "prerequisites": [
                      "ai_tokenization_bpe_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tokenization_bpe_sub3",
                    "subskillName": "Text Tokenization, Byte-Pair Encoding & Vocabularies: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_tokenization_bpe_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tokenization_bpe_sub4",
                    "subskillName": "Text Tokenization, Byte-Pair Encoding & Vocabularies: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_tokenization_bpe_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tokenization_bpe_sub5",
                    "subskillName": "Text Tokenization, Byte-Pair Encoding & Vocabularies: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_tokenization_bpe_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tokenization_bpe_sub6",
                    "subskillName": "Text Tokenization, Byte-Pair Encoding & Vocabularies: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_tokenization_bpe_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_llm_inference_params",
                "skillName": "LLM Inference Parameters: Temperature, Top-P & Top-K",
                "prerequisites": [
                  "ai_prompt_design"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_llm_inference_params_sub1",
                    "subskillName": "LLM Inference Parameters: Temperature, Top-P & Top-K: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_inference_params_sub2",
                    "subskillName": "LLM Inference Parameters: Temperature, Top-P & Top-K: Component Structure & Memory",
                    "prerequisites": [
                      "ai_llm_inference_params_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_inference_params_sub3",
                    "subskillName": "LLM Inference Parameters: Temperature, Top-P & Top-K: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_llm_inference_params_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_inference_params_sub4",
                    "subskillName": "LLM Inference Parameters: Temperature, Top-P & Top-K: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_llm_inference_params_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_inference_params_sub5",
                    "subskillName": "LLM Inference Parameters: Temperature, Top-P & Top-K: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_llm_inference_params_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_inference_params_sub6",
                    "subskillName": "LLM Inference Parameters: Temperature, Top-P & Top-K: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_llm_inference_params_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "ai_llm_sub_beginner_3",
            "name": "In-Context Learning, Few-Shot & Core Concepts",
            "skills": [
              {
                "skillId": "ai_few_shot_prompting",
                "skillName": "In-Context Learning, Few-Shot & Chain-of-Thought Prompting",
                "prerequisites": [
                  "ai_prompt_design"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_few_shot_prompting_sub1",
                    "subskillName": "In-Context Learning, Few-Shot & Chain-of-Thought Prompting: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_few_shot_prompting_sub2",
                    "subskillName": "In-Context Learning, Few-Shot & Chain-of-Thought Prompting: Component Structure & Memory",
                    "prerequisites": [
                      "ai_few_shot_prompting_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_few_shot_prompting_sub3",
                    "subskillName": "In-Context Learning, Few-Shot & Chain-of-Thought Prompting: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_few_shot_prompting_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_few_shot_prompting_sub4",
                    "subskillName": "In-Context Learning, Few-Shot & Chain-of-Thought Prompting: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_few_shot_prompting_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_few_shot_prompting_sub5",
                    "subskillName": "In-Context Learning, Few-Shot & Chain-of-Thought Prompting: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_few_shot_prompting_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_few_shot_prompting_sub6",
                    "subskillName": "In-Context Learning, Few-Shot & Chain-of-Thought Prompting: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_few_shot_prompting_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_vector_math_embeddings",
                "skillName": "Vector Embeddings & Semantic Distance Fundamentals",
                "prerequisites": [
                  "ai_math_vectors"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_vector_math_embeddings_sub1",
                    "subskillName": "Vector Embeddings & Semantic Distance Fundamentals: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_math_embeddings_sub2",
                    "subskillName": "Vector Embeddings & Semantic Distance Fundamentals: Component Structure & Memory",
                    "prerequisites": [
                      "ai_vector_math_embeddings_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_math_embeddings_sub3",
                    "subskillName": "Vector Embeddings & Semantic Distance Fundamentals: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_vector_math_embeddings_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_math_embeddings_sub4",
                    "subskillName": "Vector Embeddings & Semantic Distance Fundamentals: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_vector_math_embeddings_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_math_embeddings_sub5",
                    "subskillName": "Vector Embeddings & Semantic Distance Fundamentals: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_vector_math_embeddings_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_math_embeddings_sub6",
                    "subskillName": "Vector Embeddings & Semantic Distance Fundamentals: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_vector_math_embeddings_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_huggingface_pipelines",
                "skillName": "Hugging Face Inference Pipelines & Model Hub Setup",
                "prerequisites": [
                  "ai_python_apis"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_huggingface_pipelines_sub1",
                    "subskillName": "Hugging Face Inference Pipelines & Model Hub Setup: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_huggingface_pipelines_sub2",
                    "subskillName": "Hugging Face Inference Pipelines & Model Hub Setup: Component Structure & Memory",
                    "prerequisites": [
                      "ai_huggingface_pipelines_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_huggingface_pipelines_sub3",
                    "subskillName": "Hugging Face Inference Pipelines & Model Hub Setup: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_huggingface_pipelines_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_huggingface_pipelines_sub4",
                    "subskillName": "Hugging Face Inference Pipelines & Model Hub Setup: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_huggingface_pipelines_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_huggingface_pipelines_sub5",
                    "subskillName": "Hugging Face Inference Pipelines & Model Hub Setup: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_huggingface_pipelines_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_huggingface_pipelines_sub6",
                    "subskillName": "Hugging Face Inference Pipelines & Model Hub Setup: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_huggingface_pipelines_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_vector_db_chroma",
                "skillName": "ChromaDB Vector Store Setup & Document Indexing",
                "prerequisites": [
                  "ai_vector_math_embeddings"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "ai_vector_db_chroma_sub1",
                    "subskillName": "ChromaDB Vector Store Setup & Document Indexing: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_db_chroma_sub2",
                    "subskillName": "ChromaDB Vector Store Setup & Document Indexing: Component Structure & Memory",
                    "prerequisites": [
                      "ai_vector_db_chroma_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_db_chroma_sub3",
                    "subskillName": "ChromaDB Vector Store Setup & Document Indexing: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_vector_db_chroma_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_db_chroma_sub4",
                    "subskillName": "ChromaDB Vector Store Setup & Document Indexing: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_vector_db_chroma_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_db_chroma_sub5",
                    "subskillName": "ChromaDB Vector Store Setup & Document Indexing: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_vector_db_chroma_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_db_chroma_sub6",
                    "subskillName": "ChromaDB Vector Store Setup & Document Indexing: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_vector_db_chroma_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "ai_llm_top_intermediate",
        "name": "AI & LLM Systems Engineering — Intermediate Tier",
        "subtopics": [
          {
            "id": "ai_llm_sub_intermediate_1",
            "name": "Text Vector Embeddings & Core Concepts",
            "skills": [
              {
                "skillId": "ai_vector_embeddings",
                "skillName": "Text Vector Embeddings & Similarity Metrics",
                "prerequisites": [
                  "ai_structured_json"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_vector_embeddings_sub1",
                    "subskillName": "Text Vector Embeddings & Similarity Metrics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_embeddings_sub2",
                    "subskillName": "Text Vector Embeddings & Similarity Metrics: Component Structure & Memory",
                    "prerequisites": [
                      "ai_vector_embeddings_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_embeddings_sub3",
                    "subskillName": "Text Vector Embeddings & Similarity Metrics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_vector_embeddings_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_embeddings_sub4",
                    "subskillName": "Text Vector Embeddings & Similarity Metrics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_vector_embeddings_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_embeddings_sub5",
                    "subskillName": "Text Vector Embeddings & Similarity Metrics: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_vector_embeddings_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_embeddings_sub6",
                    "subskillName": "Text Vector Embeddings & Similarity Metrics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_vector_embeddings_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_vector_dbs_pinecone",
                "skillName": "Pinecone, ChromaDB & HNSW Vector Indexing",
                "prerequisites": [
                  "ai_vector_embeddings"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_vector_dbs_pinecone_sub1",
                    "subskillName": "Pinecone, ChromaDB & HNSW Vector Indexing: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_dbs_pinecone_sub2",
                    "subskillName": "Pinecone, ChromaDB & HNSW Vector Indexing: Component Structure & Memory",
                    "prerequisites": [
                      "ai_vector_dbs_pinecone_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_dbs_pinecone_sub3",
                    "subskillName": "Pinecone, ChromaDB & HNSW Vector Indexing: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_vector_dbs_pinecone_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_dbs_pinecone_sub4",
                    "subskillName": "Pinecone, ChromaDB & HNSW Vector Indexing: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_vector_dbs_pinecone_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_dbs_pinecone_sub5",
                    "subskillName": "Pinecone, ChromaDB & HNSW Vector Indexing: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_vector_dbs_pinecone_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vector_dbs_pinecone_sub6",
                    "subskillName": "Pinecone, ChromaDB & HNSW Vector Indexing: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_vector_dbs_pinecone_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_rag_chunking",
                "skillName": "Document Chunking Strategies & Ingestion",
                "prerequisites": [
                  "ai_vector_dbs_pinecone"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_rag_chunking_sub1",
                    "subskillName": "Document Chunking Strategies & Ingestion: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_chunking_sub2",
                    "subskillName": "Document Chunking Strategies & Ingestion: Component Structure & Memory",
                    "prerequisites": [
                      "ai_rag_chunking_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_chunking_sub3",
                    "subskillName": "Document Chunking Strategies & Ingestion: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_rag_chunking_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_chunking_sub4",
                    "subskillName": "Document Chunking Strategies & Ingestion: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_rag_chunking_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_chunking_sub5",
                    "subskillName": "Document Chunking Strategies & Ingestion: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_rag_chunking_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_chunking_sub6",
                    "subskillName": "Document Chunking Strategies & Ingestion: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_rag_chunking_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_rag_architecture_foundations",
                "skillName": "Retrieval-Augmented Generation Architecture & Query Synthesis",
                "prerequisites": [
                  "ai_rag_chunking"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_rag_architecture_foundations_sub1",
                    "subskillName": "Retrieval-Augmented Generation Architecture & Query Synthesis: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_architecture_foundations_sub2",
                    "subskillName": "Retrieval-Augmented Generation Architecture & Query Synthesis: Component Structure & Memory",
                    "prerequisites": [
                      "ai_rag_architecture_foundations_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_architecture_foundations_sub3",
                    "subskillName": "Retrieval-Augmented Generation Architecture & Query Synthesis: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_rag_architecture_foundations_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_architecture_foundations_sub4",
                    "subskillName": "Retrieval-Augmented Generation Architecture & Query Synthesis: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_rag_architecture_foundations_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_architecture_foundations_sub5",
                    "subskillName": "Retrieval-Augmented Generation Architecture & Query Synthesis: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_rag_architecture_foundations_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_architecture_foundations_sub6",
                    "subskillName": "Retrieval-Augmented Generation Architecture & Query Synthesis: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_rag_architecture_foundations_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "ai_llm_sub_intermediate_2",
            "name": "Recursive Character & Core Concepts",
            "skills": [
              {
                "skillId": "ai_advanced_chunking_strategies",
                "skillName": "Recursive Character & Semantic Markdown Chunking",
                "prerequisites": [
                  "ai_rag_chunking"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_advanced_chunking_strategies_sub1",
                    "subskillName": "Recursive Character & Semantic Markdown Chunking: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_advanced_chunking_strategies_sub2",
                    "subskillName": "Recursive Character & Semantic Markdown Chunking: Component Structure & Memory",
                    "prerequisites": [
                      "ai_advanced_chunking_strategies_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_advanced_chunking_strategies_sub3",
                    "subskillName": "Recursive Character & Semantic Markdown Chunking: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_advanced_chunking_strategies_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_advanced_chunking_strategies_sub4",
                    "subskillName": "Recursive Character & Semantic Markdown Chunking: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_advanced_chunking_strategies_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_advanced_chunking_strategies_sub5",
                    "subskillName": "Recursive Character & Semantic Markdown Chunking: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_advanced_chunking_strategies_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_advanced_chunking_strategies_sub6",
                    "subskillName": "Recursive Character & Semantic Markdown Chunking: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_advanced_chunking_strategies_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_langchain_chains_runnables",
                "skillName": "LangChain Expression Language (LCEL) & Sequential Chains",
                "prerequisites": [
                  "ai_rag_architecture_foundations"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_langchain_chains_runnables_sub1",
                    "subskillName": "LangChain Expression Language (LCEL) & Sequential Chains: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_langchain_chains_runnables_sub2",
                    "subskillName": "LangChain Expression Language (LCEL) & Sequential Chains: Component Structure & Memory",
                    "prerequisites": [
                      "ai_langchain_chains_runnables_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_langchain_chains_runnables_sub3",
                    "subskillName": "LangChain Expression Language (LCEL) & Sequential Chains: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_langchain_chains_runnables_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_langchain_chains_runnables_sub4",
                    "subskillName": "LangChain Expression Language (LCEL) & Sequential Chains: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_langchain_chains_runnables_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_langchain_chains_runnables_sub5",
                    "subskillName": "LangChain Expression Language (LCEL) & Sequential Chains: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_langchain_chains_runnables_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_langchain_chains_runnables_sub6",
                    "subskillName": "LangChain Expression Language (LCEL) & Sequential Chains: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_langchain_chains_runnables_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_llamaindex_document_indexes",
                "skillName": "LlamaIndex Hierarchical Indexing & Data Connectors",
                "prerequisites": [
                  "ai_rag_architecture_foundations"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_llamaindex_document_indexes_sub1",
                    "subskillName": "LlamaIndex Hierarchical Indexing & Data Connectors: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llamaindex_document_indexes_sub2",
                    "subskillName": "LlamaIndex Hierarchical Indexing & Data Connectors: Component Structure & Memory",
                    "prerequisites": [
                      "ai_llamaindex_document_indexes_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llamaindex_document_indexes_sub3",
                    "subskillName": "LlamaIndex Hierarchical Indexing & Data Connectors: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_llamaindex_document_indexes_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llamaindex_document_indexes_sub4",
                    "subskillName": "LlamaIndex Hierarchical Indexing & Data Connectors: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_llamaindex_document_indexes_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llamaindex_document_indexes_sub5",
                    "subskillName": "LlamaIndex Hierarchical Indexing & Data Connectors: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_llamaindex_document_indexes_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llamaindex_document_indexes_sub6",
                    "subskillName": "LlamaIndex Hierarchical Indexing & Data Connectors: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_llamaindex_document_indexes_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_function_calling_tools",
                "skillName": "LLM Function Calling, Tools Binding & API Integrations",
                "prerequisites": [
                  "ai_structured_json"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_function_calling_tools_sub1",
                    "subskillName": "LLM Function Calling, Tools Binding & API Integrations: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_function_calling_tools_sub2",
                    "subskillName": "LLM Function Calling, Tools Binding & API Integrations: Component Structure & Memory",
                    "prerequisites": [
                      "ai_function_calling_tools_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_function_calling_tools_sub3",
                    "subskillName": "LLM Function Calling, Tools Binding & API Integrations: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_function_calling_tools_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_function_calling_tools_sub4",
                    "subskillName": "LLM Function Calling, Tools Binding & API Integrations: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_function_calling_tools_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_function_calling_tools_sub5",
                    "subskillName": "LLM Function Calling, Tools Binding & API Integrations: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_function_calling_tools_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_function_calling_tools_sub6",
                    "subskillName": "LLM Function Calling, Tools Binding & API Integrations: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_function_calling_tools_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "ai_llm_sub_intermediate_3",
            "name": "Multimodal Vision & Core Concepts",
            "skills": [
              {
                "skillId": "ai_multimodal_vision_apis",
                "skillName": "Multimodal Vision & Audio Inference with Gemini/GPT-4V",
                "prerequisites": [
                  "ai_structured_json"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_multimodal_vision_apis_sub1",
                    "subskillName": "Multimodal Vision & Audio Inference with Gemini/GPT-4V: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multimodal_vision_apis_sub2",
                    "subskillName": "Multimodal Vision & Audio Inference with Gemini/GPT-4V: Component Structure & Memory",
                    "prerequisites": [
                      "ai_multimodal_vision_apis_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multimodal_vision_apis_sub3",
                    "subskillName": "Multimodal Vision & Audio Inference with Gemini/GPT-4V: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_multimodal_vision_apis_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multimodal_vision_apis_sub4",
                    "subskillName": "Multimodal Vision & Audio Inference with Gemini/GPT-4V: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_multimodal_vision_apis_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multimodal_vision_apis_sub5",
                    "subskillName": "Multimodal Vision & Audio Inference with Gemini/GPT-4V: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_multimodal_vision_apis_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multimodal_vision_apis_sub6",
                    "subskillName": "Multimodal Vision & Audio Inference with Gemini/GPT-4V: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_multimodal_vision_apis_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_rag_evaluation_ragas",
                "skillName": "RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy",
                "prerequisites": [
                  "ai_rag_architecture_foundations"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_rag_evaluation_ragas_sub1",
                    "subskillName": "RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_evaluation_ragas_sub2",
                    "subskillName": "RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy: Component Structure & Memory",
                    "prerequisites": [
                      "ai_rag_evaluation_ragas_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_evaluation_ragas_sub3",
                    "subskillName": "RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_rag_evaluation_ragas_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_evaluation_ragas_sub4",
                    "subskillName": "RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_rag_evaluation_ragas_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_evaluation_ragas_sub5",
                    "subskillName": "RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_rag_evaluation_ragas_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rag_evaluation_ragas_sub6",
                    "subskillName": "RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_rag_evaluation_ragas_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_peft_lora_finetuning",
                "skillName": "Parameter-Efficient Fine-Tuning with LoRA & QLoRA",
                "prerequisites": [
                  "ai_vector_embeddings"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_peft_lora_finetuning_sub1",
                    "subskillName": "Parameter-Efficient Fine-Tuning with LoRA & QLoRA: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_peft_lora_finetuning_sub2",
                    "subskillName": "Parameter-Efficient Fine-Tuning with LoRA & QLoRA: Component Structure & Memory",
                    "prerequisites": [
                      "ai_peft_lora_finetuning_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_peft_lora_finetuning_sub3",
                    "subskillName": "Parameter-Efficient Fine-Tuning with LoRA & QLoRA: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_peft_lora_finetuning_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_peft_lora_finetuning_sub4",
                    "subskillName": "Parameter-Efficient Fine-Tuning with LoRA & QLoRA: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_peft_lora_finetuning_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_peft_lora_finetuning_sub5",
                    "subskillName": "Parameter-Efficient Fine-Tuning with LoRA & QLoRA: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_peft_lora_finetuning_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_peft_lora_finetuning_sub6",
                    "subskillName": "Parameter-Efficient Fine-Tuning with LoRA & QLoRA: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_peft_lora_finetuning_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_synthetic_data_generation",
                "skillName": "Synthetic Data Generation & Data Curation for LLMs",
                "prerequisites": [
                  "ai_structured_json"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "ai_synthetic_data_generation_sub1",
                    "subskillName": "Synthetic Data Generation & Data Curation for LLMs: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_synthetic_data_generation_sub2",
                    "subskillName": "Synthetic Data Generation & Data Curation for LLMs: Component Structure & Memory",
                    "prerequisites": [
                      "ai_synthetic_data_generation_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_synthetic_data_generation_sub3",
                    "subskillName": "Synthetic Data Generation & Data Curation for LLMs: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_synthetic_data_generation_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_synthetic_data_generation_sub4",
                    "subskillName": "Synthetic Data Generation & Data Curation for LLMs: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_synthetic_data_generation_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_synthetic_data_generation_sub5",
                    "subskillName": "Synthetic Data Generation & Data Curation for LLMs: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_synthetic_data_generation_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_synthetic_data_generation_sub6",
                    "subskillName": "Synthetic Data Generation & Data Curation for LLMs: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_synthetic_data_generation_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "ai_llm_top_advanced",
        "name": "AI & LLM Systems Engineering — Advanced Tier",
        "subtopics": [
          {
            "id": "ai_llm_sub_advanced_1",
            "name": "Hybrid Search & Core Concepts",
            "skills": [
              {
                "skillId": "ai_hybrid_search_rerank",
                "skillName": "Hybrid Search & Cross-Encoder Re-Ranking",
                "prerequisites": [
                  "ai_rag_chunking"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_hybrid_search_rerank_sub1",
                    "subskillName": "Hybrid Search & Cross-Encoder Re-Ranking: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_hybrid_search_rerank_sub2",
                    "subskillName": "Hybrid Search & Cross-Encoder Re-Ranking: Component Structure & Memory",
                    "prerequisites": [
                      "ai_hybrid_search_rerank_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_hybrid_search_rerank_sub3",
                    "subskillName": "Hybrid Search & Cross-Encoder Re-Ranking: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_hybrid_search_rerank_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_hybrid_search_rerank_sub4",
                    "subskillName": "Hybrid Search & Cross-Encoder Re-Ranking: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_hybrid_search_rerank_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_hybrid_search_rerank_sub5",
                    "subskillName": "Hybrid Search & Cross-Encoder Re-Ranking: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_hybrid_search_rerank_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_hybrid_search_rerank_sub6",
                    "subskillName": "Hybrid Search & Cross-Encoder Re-Ranking: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_hybrid_search_rerank_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_lora_fine_tuning",
                "skillName": "LoRA & QLoRA Parameter Efficient Tuning",
                "prerequisites": [
                  "ai_hybrid_search_rerank"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_lora_fine_tuning_sub1",
                    "subskillName": "LoRA & QLoRA Parameter Efficient Tuning: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_lora_fine_tuning_sub2",
                    "subskillName": "LoRA & QLoRA Parameter Efficient Tuning: Component Structure & Memory",
                    "prerequisites": [
                      "ai_lora_fine_tuning_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_lora_fine_tuning_sub3",
                    "subskillName": "LoRA & QLoRA Parameter Efficient Tuning: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_lora_fine_tuning_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_lora_fine_tuning_sub4",
                    "subskillName": "LoRA & QLoRA Parameter Efficient Tuning: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_lora_fine_tuning_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_lora_fine_tuning_sub5",
                    "subskillName": "LoRA & QLoRA Parameter Efficient Tuning: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_lora_fine_tuning_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_lora_fine_tuning_sub6",
                    "subskillName": "LoRA & QLoRA Parameter Efficient Tuning: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_lora_fine_tuning_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_quantization_serving",
                "skillName": "Model Quantization (GGUF) & Local Ollama",
                "prerequisites": [
                  "ai_lora_fine_tuning"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_quantization_serving_sub1",
                    "subskillName": "Model Quantization (GGUF) & Local Ollama: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_quantization_serving_sub2",
                    "subskillName": "Model Quantization (GGUF) & Local Ollama: Component Structure & Memory",
                    "prerequisites": [
                      "ai_quantization_serving_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_quantization_serving_sub3",
                    "subskillName": "Model Quantization (GGUF) & Local Ollama: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_quantization_serving_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_quantization_serving_sub4",
                    "subskillName": "Model Quantization (GGUF) & Local Ollama: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_quantization_serving_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_quantization_serving_sub5",
                    "subskillName": "Model Quantization (GGUF) & Local Ollama: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_quantization_serving_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_quantization_serving_sub6",
                    "subskillName": "Model Quantization (GGUF) & Local Ollama: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_quantization_serving_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_react_agent_loop",
                "skillName": "ReAct Agent Execution Loop Architecture",
                "prerequisites": [
                  "ai_quantization_serving"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_react_agent_loop_sub1",
                    "subskillName": "ReAct Agent Execution Loop Architecture: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_react_agent_loop_sub2",
                    "subskillName": "ReAct Agent Execution Loop Architecture: Component Structure & Memory",
                    "prerequisites": [
                      "ai_react_agent_loop_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_react_agent_loop_sub3",
                    "subskillName": "ReAct Agent Execution Loop Architecture: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_react_agent_loop_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_react_agent_loop_sub4",
                    "subskillName": "ReAct Agent Execution Loop Architecture: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_react_agent_loop_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_react_agent_loop_sub5",
                    "subskillName": "ReAct Agent Execution Loop Architecture: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_react_agent_loop_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_react_agent_loop_sub6",
                    "subskillName": "ReAct Agent Execution Loop Architecture: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_react_agent_loop_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "ai_llm_sub_advanced_2",
            "name": "Function Calling & Core Concepts",
            "skills": [
              {
                "skillId": "ai_tool_calling_schema",
                "skillName": "Function Calling & Schema Tool Binding",
                "prerequisites": [
                  "ai_react_agent_loop"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_tool_calling_schema_sub1",
                    "subskillName": "Function Calling & Schema Tool Binding: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tool_calling_schema_sub2",
                    "subskillName": "Function Calling & Schema Tool Binding: Component Structure & Memory",
                    "prerequisites": [
                      "ai_tool_calling_schema_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tool_calling_schema_sub3",
                    "subskillName": "Function Calling & Schema Tool Binding: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_tool_calling_schema_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tool_calling_schema_sub4",
                    "subskillName": "Function Calling & Schema Tool Binding: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_tool_calling_schema_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tool_calling_schema_sub5",
                    "subskillName": "Function Calling & Schema Tool Binding: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_tool_calling_schema_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_tool_calling_schema_sub6",
                    "subskillName": "Function Calling & Schema Tool Binding: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_tool_calling_schema_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_guardrails_nemo",
                "skillName": "NeMo Guardrails & Hallucination Prevention",
                "prerequisites": [
                  "ai_tool_calling_schema"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_guardrails_nemo_sub1",
                    "subskillName": "NeMo Guardrails & Hallucination Prevention: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_guardrails_nemo_sub2",
                    "subskillName": "NeMo Guardrails & Hallucination Prevention: Component Structure & Memory",
                    "prerequisites": [
                      "ai_guardrails_nemo_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_guardrails_nemo_sub3",
                    "subskillName": "NeMo Guardrails & Hallucination Prevention: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_guardrails_nemo_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_guardrails_nemo_sub4",
                    "subskillName": "NeMo Guardrails & Hallucination Prevention: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_guardrails_nemo_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_guardrails_nemo_sub5",
                    "subskillName": "NeMo Guardrails & Hallucination Prevention: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_guardrails_nemo_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_guardrails_nemo_sub6",
                    "subskillName": "NeMo Guardrails & Hallucination Prevention: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_guardrails_nemo_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_llm_eval_capstone",
                "skillName": "End-to-End LLM Agent Systems Capstone",
                "prerequisites": [
                  "ai_guardrails_nemo"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_llm_eval_capstone_sub1",
                    "subskillName": "End-to-End LLM Agent Systems Capstone: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_eval_capstone_sub2",
                    "subskillName": "End-to-End LLM Agent Systems Capstone: Component Structure & Memory",
                    "prerequisites": [
                      "ai_llm_eval_capstone_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_eval_capstone_sub3",
                    "subskillName": "End-to-End LLM Agent Systems Capstone: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_llm_eval_capstone_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_eval_capstone_sub4",
                    "subskillName": "End-to-End LLM Agent Systems Capstone: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_llm_eval_capstone_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_eval_capstone_sub5",
                    "subskillName": "End-to-End LLM Agent Systems Capstone: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_llm_eval_capstone_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_eval_capstone_sub6",
                    "subskillName": "End-to-End LLM Agent Systems Capstone: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_llm_eval_capstone_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_multi_agent_orchestration",
                "skillName": "Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines",
                "prerequisites": [
                  "ai_react_agent_loop"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_multi_agent_orchestration_sub1",
                    "subskillName": "Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multi_agent_orchestration_sub2",
                    "subskillName": "Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines: Component Structure & Memory",
                    "prerequisites": [
                      "ai_multi_agent_orchestration_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multi_agent_orchestration_sub3",
                    "subskillName": "Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_multi_agent_orchestration_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multi_agent_orchestration_sub4",
                    "subskillName": "Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_multi_agent_orchestration_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multi_agent_orchestration_sub5",
                    "subskillName": "Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_multi_agent_orchestration_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_multi_agent_orchestration_sub6",
                    "subskillName": "Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_multi_agent_orchestration_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "ai_llm_sub_advanced_3",
            "name": "vLLM High-Throughput Serving, PagedAttention & Core Concepts",
            "skills": [
              {
                "skillId": "ai_vllm_paged_attention",
                "skillName": "vLLM High-Throughput Serving, PagedAttention & Continuous Batching",
                "prerequisites": [
                  "ai_quantization_serving"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_vllm_paged_attention_sub1",
                    "subskillName": "vLLM High-Throughput Serving, PagedAttention & Continuous Batching: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vllm_paged_attention_sub2",
                    "subskillName": "vLLM High-Throughput Serving, PagedAttention & Continuous Batching: Component Structure & Memory",
                    "prerequisites": [
                      "ai_vllm_paged_attention_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vllm_paged_attention_sub3",
                    "subskillName": "vLLM High-Throughput Serving, PagedAttention & Continuous Batching: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_vllm_paged_attention_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vllm_paged_attention_sub4",
                    "subskillName": "vLLM High-Throughput Serving, PagedAttention & Continuous Batching: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_vllm_paged_attention_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vllm_paged_attention_sub5",
                    "subskillName": "vLLM High-Throughput Serving, PagedAttention & Continuous Batching: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_vllm_paged_attention_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_vllm_paged_attention_sub6",
                    "subskillName": "vLLM High-Throughput Serving, PagedAttention & Continuous Batching: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_vllm_paged_attention_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_transformer_self_attention",
                "skillName": "Transformer Self-Attention, Multi-Head & FlashAttention Mechanics",
                "prerequisites": [
                  "ai_lora_fine_tuning"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_transformer_self_attention_sub1",
                    "subskillName": "Transformer Self-Attention, Multi-Head & FlashAttention Mechanics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_transformer_self_attention_sub2",
                    "subskillName": "Transformer Self-Attention, Multi-Head & FlashAttention Mechanics: Component Structure & Memory",
                    "prerequisites": [
                      "ai_transformer_self_attention_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_transformer_self_attention_sub3",
                    "subskillName": "Transformer Self-Attention, Multi-Head & FlashAttention Mechanics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_transformer_self_attention_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_transformer_self_attention_sub4",
                    "subskillName": "Transformer Self-Attention, Multi-Head & FlashAttention Mechanics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_transformer_self_attention_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_transformer_self_attention_sub5",
                    "subskillName": "Transformer Self-Attention, Multi-Head & FlashAttention Mechanics: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_transformer_self_attention_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_transformer_self_attention_sub6",
                    "subskillName": "Transformer Self-Attention, Multi-Head & FlashAttention Mechanics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_transformer_self_attention_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_rlhf_dpo_alignment",
                "skillName": "Model Alignment with Direct Preference Optimization (DPO) & RLHF",
                "prerequisites": [
                  "ai_lora_fine_tuning"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_rlhf_dpo_alignment_sub1",
                    "subskillName": "Model Alignment with Direct Preference Optimization (DPO) & RLHF: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rlhf_dpo_alignment_sub2",
                    "subskillName": "Model Alignment with Direct Preference Optimization (DPO) & RLHF: Component Structure & Memory",
                    "prerequisites": [
                      "ai_rlhf_dpo_alignment_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rlhf_dpo_alignment_sub3",
                    "subskillName": "Model Alignment with Direct Preference Optimization (DPO) & RLHF: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_rlhf_dpo_alignment_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rlhf_dpo_alignment_sub4",
                    "subskillName": "Model Alignment with Direct Preference Optimization (DPO) & RLHF: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_rlhf_dpo_alignment_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rlhf_dpo_alignment_sub5",
                    "subskillName": "Model Alignment with Direct Preference Optimization (DPO) & RLHF: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_rlhf_dpo_alignment_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_rlhf_dpo_alignment_sub6",
                    "subskillName": "Model Alignment with Direct Preference Optimization (DPO) & RLHF: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_rlhf_dpo_alignment_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "ai_llm_security_jailbreak_defense",
                "skillName": "Adversarial Prompt Injection Defense & Enterprise Security Guardrails",
                "prerequisites": [
                  "ai_guardrails_nemo"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "ai_llm_security_jailbreak_defense_sub1",
                    "subskillName": "Adversarial Prompt Injection Defense & Enterprise Security Guardrails: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_security_jailbreak_defense_sub2",
                    "subskillName": "Adversarial Prompt Injection Defense & Enterprise Security Guardrails: Component Structure & Memory",
                    "prerequisites": [
                      "ai_llm_security_jailbreak_defense_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_security_jailbreak_defense_sub3",
                    "subskillName": "Adversarial Prompt Injection Defense & Enterprise Security Guardrails: Implementation Patterns & Flow",
                    "prerequisites": [
                      "ai_llm_security_jailbreak_defense_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_security_jailbreak_defense_sub4",
                    "subskillName": "Adversarial Prompt Injection Defense & Enterprise Security Guardrails: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "ai_llm_security_jailbreak_defense_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_security_jailbreak_defense_sub5",
                    "subskillName": "Adversarial Prompt Injection Defense & Enterprise Security Guardrails: Integration & Placement Questions",
                    "prerequisites": [
                      "ai_llm_security_jailbreak_defense_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "ai_llm_security_jailbreak_defense_sub6",
                    "subskillName": "Adversarial Prompt Injection Defense & Enterprise Security Guardrails: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "ai_llm_security_jailbreak_defense_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "system_design": {
    "domainId": "system_design",
    "domainName": "System Design & Distributed Architecture",
    "topics": [
      {
        "id": "system_design_top_beginner",
        "name": "System Design & Distributed Architecture — Beginner Tier",
        "subtopics": [
          {
            "id": "system_design_sub_beginner_1",
            "name": "Client-Server Principles & Core Concepts",
            "skills": [
              {
                "skillId": "sd_http_client_server",
                "skillName": "Client-Server Principles & HTTP/HTTPS",
                "prerequisites": [],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_http_client_server_sub1",
                    "subskillName": "Client-Server Principles & HTTP/HTTPS: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_http_client_server_sub2",
                    "subskillName": "Client-Server Principles & HTTP/HTTPS: Component Structure & Memory",
                    "prerequisites": [
                      "sd_http_client_server_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_http_client_server_sub3",
                    "subskillName": "Client-Server Principles & HTTP/HTTPS: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_http_client_server_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_http_client_server_sub4",
                    "subskillName": "Client-Server Principles & HTTP/HTTPS: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_http_client_server_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_http_client_server_sub5",
                    "subskillName": "Client-Server Principles & HTTP/HTTPS: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_http_client_server_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_http_client_server_sub6",
                    "subskillName": "Client-Server Principles & HTTP/HTTPS: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_http_client_server_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_web_servers_sockets",
                "skillName": "Web Servers & WebSockets Architecture",
                "prerequisites": [
                  "sd_http_client_server"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_web_servers_sockets_sub1",
                    "subskillName": "Web Servers & WebSockets Architecture: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_web_servers_sockets_sub2",
                    "subskillName": "Web Servers & WebSockets Architecture: Component Structure & Memory",
                    "prerequisites": [
                      "sd_web_servers_sockets_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_web_servers_sockets_sub3",
                    "subskillName": "Web Servers & WebSockets Architecture: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_web_servers_sockets_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_web_servers_sockets_sub4",
                    "subskillName": "Web Servers & WebSockets Architecture: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_web_servers_sockets_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_web_servers_sockets_sub5",
                    "subskillName": "Web Servers & WebSockets Architecture: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_web_servers_sockets_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_web_servers_sockets_sub6",
                    "subskillName": "Web Servers & WebSockets Architecture: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_web_servers_sockets_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_load_balancers",
                "skillName": "Layer 4 vs Layer 7 Load Balancing",
                "prerequisites": [
                  "sd_web_servers_sockets"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_load_balancers_sub1",
                    "subskillName": "Layer 4 vs Layer 7 Load Balancing: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_load_balancers_sub2",
                    "subskillName": "Layer 4 vs Layer 7 Load Balancing: Component Structure & Memory",
                    "prerequisites": [
                      "sd_load_balancers_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_load_balancers_sub3",
                    "subskillName": "Layer 4 vs Layer 7 Load Balancing: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_load_balancers_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_load_balancers_sub4",
                    "subskillName": "Layer 4 vs Layer 7 Load Balancing: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_load_balancers_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_load_balancers_sub5",
                    "subskillName": "Layer 4 vs Layer 7 Load Balancing: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_load_balancers_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_load_balancers_sub6",
                    "subskillName": "Layer 4 vs Layer 7 Load Balancing: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_load_balancers_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_dns_cdn_fundamentals",
                "skillName": "DNS Resolution, Anycast & Global CDN Edge Caching",
                "prerequisites": [
                  "sd_http_client_server"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_dns_cdn_fundamentals_sub1",
                    "subskillName": "DNS Resolution, Anycast & Global CDN Edge Caching: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_dns_cdn_fundamentals_sub2",
                    "subskillName": "DNS Resolution, Anycast & Global CDN Edge Caching: Component Structure & Memory",
                    "prerequisites": [
                      "sd_dns_cdn_fundamentals_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_dns_cdn_fundamentals_sub3",
                    "subskillName": "DNS Resolution, Anycast & Global CDN Edge Caching: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_dns_cdn_fundamentals_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_dns_cdn_fundamentals_sub4",
                    "subskillName": "DNS Resolution, Anycast & Global CDN Edge Caching: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_dns_cdn_fundamentals_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_dns_cdn_fundamentals_sub5",
                    "subskillName": "DNS Resolution, Anycast & Global CDN Edge Caching: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_dns_cdn_fundamentals_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_dns_cdn_fundamentals_sub6",
                    "subskillName": "DNS Resolution, Anycast & Global CDN Edge Caching: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_dns_cdn_fundamentals_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "system_design_sub_beginner_2",
            "name": "Stateless Web Tier Design & Core Concepts",
            "skills": [
              {
                "skillId": "sd_stateless_architecture",
                "skillName": "Stateless Web Tier Design & Session State Offloading",
                "prerequisites": [
                  "sd_web_servers_sockets"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_stateless_architecture_sub1",
                    "subskillName": "Stateless Web Tier Design & Session State Offloading: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_stateless_architecture_sub2",
                    "subskillName": "Stateless Web Tier Design & Session State Offloading: Component Structure & Memory",
                    "prerequisites": [
                      "sd_stateless_architecture_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_stateless_architecture_sub3",
                    "subskillName": "Stateless Web Tier Design & Session State Offloading: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_stateless_architecture_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_stateless_architecture_sub4",
                    "subskillName": "Stateless Web Tier Design & Session State Offloading: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_stateless_architecture_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_stateless_architecture_sub5",
                    "subskillName": "Stateless Web Tier Design & Session State Offloading: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_stateless_architecture_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_stateless_architecture_sub6",
                    "subskillName": "Stateless Web Tier Design & Session State Offloading: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_stateless_architecture_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_database_sql_vs_nosql",
                "skillName": "Relational SQL vs NoSQL Data Model Selection",
                "prerequisites": [
                  "sd_http_client_server"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_database_sql_vs_nosql_sub1",
                    "subskillName": "Relational SQL vs NoSQL Data Model Selection: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_sql_vs_nosql_sub2",
                    "subskillName": "Relational SQL vs NoSQL Data Model Selection: Component Structure & Memory",
                    "prerequisites": [
                      "sd_database_sql_vs_nosql_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_sql_vs_nosql_sub3",
                    "subskillName": "Relational SQL vs NoSQL Data Model Selection: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_database_sql_vs_nosql_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_sql_vs_nosql_sub4",
                    "subskillName": "Relational SQL vs NoSQL Data Model Selection: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_database_sql_vs_nosql_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_sql_vs_nosql_sub5",
                    "subskillName": "Relational SQL vs NoSQL Data Model Selection: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_database_sql_vs_nosql_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_sql_vs_nosql_sub6",
                    "subskillName": "Relational SQL vs NoSQL Data Model Selection: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_database_sql_vs_nosql_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_caching_strategies",
                "skillName": "Cache Strategies: Cache-Aside, Write-Through & Eviction LRU",
                "prerequisites": [
                  "sd_web_servers_sockets"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_caching_strategies_sub1",
                    "subskillName": "Cache Strategies: Cache-Aside, Write-Through & Eviction LRU: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_caching_strategies_sub2",
                    "subskillName": "Cache Strategies: Cache-Aside, Write-Through & Eviction LRU: Component Structure & Memory",
                    "prerequisites": [
                      "sd_caching_strategies_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_caching_strategies_sub3",
                    "subskillName": "Cache Strategies: Cache-Aside, Write-Through & Eviction LRU: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_caching_strategies_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_caching_strategies_sub4",
                    "subskillName": "Cache Strategies: Cache-Aside, Write-Through & Eviction LRU: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_caching_strategies_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_caching_strategies_sub5",
                    "subskillName": "Cache Strategies: Cache-Aside, Write-Through & Eviction LRU: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_caching_strategies_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_caching_strategies_sub6",
                    "subskillName": "Cache Strategies: Cache-Aside, Write-Through & Eviction LRU: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_caching_strategies_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_api_design_rest_grpc",
                "skillName": "API Architecture Trade-Offs: REST, GraphQL & gRPC",
                "prerequisites": [
                  "sd_http_client_server"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_api_design_rest_grpc_sub1",
                    "subskillName": "API Architecture Trade-Offs: REST, GraphQL & gRPC: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_design_rest_grpc_sub2",
                    "subskillName": "API Architecture Trade-Offs: REST, GraphQL & gRPC: Component Structure & Memory",
                    "prerequisites": [
                      "sd_api_design_rest_grpc_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_design_rest_grpc_sub3",
                    "subskillName": "API Architecture Trade-Offs: REST, GraphQL & gRPC: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_api_design_rest_grpc_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_design_rest_grpc_sub4",
                    "subskillName": "API Architecture Trade-Offs: REST, GraphQL & gRPC: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_api_design_rest_grpc_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_design_rest_grpc_sub5",
                    "subskillName": "API Architecture Trade-Offs: REST, GraphQL & gRPC: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_api_design_rest_grpc_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_design_rest_grpc_sub6",
                    "subskillName": "API Architecture Trade-Offs: REST, GraphQL & gRPC: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_api_design_rest_grpc_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "system_design_sub_beginner_3",
            "name": "Vertical vs Horizontal Scaling & Core Concepts",
            "skills": [
              {
                "skillId": "sd_vertical_horizontal_scaling",
                "skillName": "Vertical vs Horizontal Scaling & Bottleneck Identification",
                "prerequisites": [
                  "sd_load_balancers"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_vertical_horizontal_scaling_sub1",
                    "subskillName": "Vertical vs Horizontal Scaling & Bottleneck Identification: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_vertical_horizontal_scaling_sub2",
                    "subskillName": "Vertical vs Horizontal Scaling & Bottleneck Identification: Component Structure & Memory",
                    "prerequisites": [
                      "sd_vertical_horizontal_scaling_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_vertical_horizontal_scaling_sub3",
                    "subskillName": "Vertical vs Horizontal Scaling & Bottleneck Identification: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_vertical_horizontal_scaling_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_vertical_horizontal_scaling_sub4",
                    "subskillName": "Vertical vs Horizontal Scaling & Bottleneck Identification: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_vertical_horizontal_scaling_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_vertical_horizontal_scaling_sub5",
                    "subskillName": "Vertical vs Horizontal Scaling & Bottleneck Identification: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_vertical_horizontal_scaling_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_vertical_horizontal_scaling_sub6",
                    "subskillName": "Vertical vs Horizontal Scaling & Bottleneck Identification: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_vertical_horizontal_scaling_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_database_indexing_btree",
                "skillName": "Database B-Tree Indexing, Query Optimization & Execution Plans",
                "prerequisites": [
                  "sd_database_sql_vs_nosql"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_database_indexing_btree_sub1",
                    "subskillName": "Database B-Tree Indexing, Query Optimization & Execution Plans: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_indexing_btree_sub2",
                    "subskillName": "Database B-Tree Indexing, Query Optimization & Execution Plans: Component Structure & Memory",
                    "prerequisites": [
                      "sd_database_indexing_btree_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_indexing_btree_sub3",
                    "subskillName": "Database B-Tree Indexing, Query Optimization & Execution Plans: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_database_indexing_btree_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_indexing_btree_sub4",
                    "subskillName": "Database B-Tree Indexing, Query Optimization & Execution Plans: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_database_indexing_btree_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_indexing_btree_sub5",
                    "subskillName": "Database B-Tree Indexing, Query Optimization & Execution Plans: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_database_indexing_btree_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_indexing_btree_sub6",
                    "subskillName": "Database B-Tree Indexing, Query Optimization & Execution Plans: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_database_indexing_btree_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_rate_limiting_algorithms",
                "skillName": "Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window",
                "prerequisites": [
                  "sd_load_balancers"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_rate_limiting_algorithms_sub1",
                    "subskillName": "Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rate_limiting_algorithms_sub2",
                    "subskillName": "Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window: Component Structure & Memory",
                    "prerequisites": [
                      "sd_rate_limiting_algorithms_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rate_limiting_algorithms_sub3",
                    "subskillName": "Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_rate_limiting_algorithms_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rate_limiting_algorithms_sub4",
                    "subskillName": "Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_rate_limiting_algorithms_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rate_limiting_algorithms_sub5",
                    "subskillName": "Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_rate_limiting_algorithms_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rate_limiting_algorithms_sub6",
                    "subskillName": "Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_rate_limiting_algorithms_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_metrics_logging_telemetry",
                "skillName": "Telemetry, Structured Logging & System Monitoring Fundamentals",
                "prerequisites": [
                  "sd_web_servers_sockets"
                ],
                "difficulty": "BEGINNER",
                "estimatedHours": 4,
                "subskills": [
                  {
                    "subskillId": "sd_metrics_logging_telemetry_sub1",
                    "subskillName": "Telemetry, Structured Logging & System Monitoring Fundamentals: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_metrics_logging_telemetry_sub2",
                    "subskillName": "Telemetry, Structured Logging & System Monitoring Fundamentals: Component Structure & Memory",
                    "prerequisites": [
                      "sd_metrics_logging_telemetry_sub1"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_metrics_logging_telemetry_sub3",
                    "subskillName": "Telemetry, Structured Logging & System Monitoring Fundamentals: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_metrics_logging_telemetry_sub2"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_metrics_logging_telemetry_sub4",
                    "subskillName": "Telemetry, Structured Logging & System Monitoring Fundamentals: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_metrics_logging_telemetry_sub3"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_metrics_logging_telemetry_sub5",
                    "subskillName": "Telemetry, Structured Logging & System Monitoring Fundamentals: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_metrics_logging_telemetry_sub4"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_metrics_logging_telemetry_sub6",
                    "subskillName": "Telemetry, Structured Logging & System Monitoring Fundamentals: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_metrics_logging_telemetry_sub5"
                    ],
                    "difficulty": "BEGINNER",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "system_design_top_intermediate",
        "name": "System Design & Distributed Architecture — Intermediate Tier",
        "subtopics": [
          {
            "id": "system_design_sub_intermediate_1",
            "name": "Consistent Hashing & Core Concepts",
            "skills": [
              {
                "skillId": "sd_consistent_hashing",
                "skillName": "Consistent Hashing & Stateless App Nodes",
                "prerequisites": [
                  "sd_load_balancers"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_consistent_hashing_sub1",
                    "subskillName": "Consistent Hashing & Stateless App Nodes: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consistent_hashing_sub2",
                    "subskillName": "Consistent Hashing & Stateless App Nodes: Component Structure & Memory",
                    "prerequisites": [
                      "sd_consistent_hashing_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consistent_hashing_sub3",
                    "subskillName": "Consistent Hashing & Stateless App Nodes: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_consistent_hashing_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consistent_hashing_sub4",
                    "subskillName": "Consistent Hashing & Stateless App Nodes: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_consistent_hashing_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consistent_hashing_sub5",
                    "subskillName": "Consistent Hashing & Stateless App Nodes: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_consistent_hashing_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consistent_hashing_sub6",
                    "subskillName": "Consistent Hashing & Stateless App Nodes: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_consistent_hashing_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_redis_cache_aside",
                "skillName": "Redis In-Memory Store & Cache Patterns",
                "prerequisites": [
                  "sd_consistent_hashing"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_redis_cache_aside_sub1",
                    "subskillName": "Redis In-Memory Store & Cache Patterns: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_redis_cache_aside_sub2",
                    "subskillName": "Redis In-Memory Store & Cache Patterns: Component Structure & Memory",
                    "prerequisites": [
                      "sd_redis_cache_aside_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_redis_cache_aside_sub3",
                    "subskillName": "Redis In-Memory Store & Cache Patterns: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_redis_cache_aside_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_redis_cache_aside_sub4",
                    "subskillName": "Redis In-Memory Store & Cache Patterns: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_redis_cache_aside_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_redis_cache_aside_sub5",
                    "subskillName": "Redis In-Memory Store & Cache Patterns: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_redis_cache_aside_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_redis_cache_aside_sub6",
                    "subskillName": "Redis In-Memory Store & Cache Patterns: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_redis_cache_aside_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_cdn_invalidation",
                "skillName": "Content Delivery Networks (CDNs)",
                "prerequisites": [
                  "sd_redis_cache_aside"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_cdn_invalidation_sub1",
                    "subskillName": "Content Delivery Networks (CDNs): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cdn_invalidation_sub2",
                    "subskillName": "Content Delivery Networks (CDNs): Component Structure & Memory",
                    "prerequisites": [
                      "sd_cdn_invalidation_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cdn_invalidation_sub3",
                    "subskillName": "Content Delivery Networks (CDNs): Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_cdn_invalidation_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cdn_invalidation_sub4",
                    "subskillName": "Content Delivery Networks (CDNs): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_cdn_invalidation_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cdn_invalidation_sub5",
                    "subskillName": "Content Delivery Networks (CDNs): Integration & Placement Questions",
                    "prerequisites": [
                      "sd_cdn_invalidation_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cdn_invalidation_sub6",
                    "subskillName": "Content Delivery Networks (CDNs): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_cdn_invalidation_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_read_replicas",
                "skillName": "Master-Slave Read Replicas & Replication Lag",
                "prerequisites": [
                  "sd_cdn_invalidation"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_read_replicas_sub1",
                    "subskillName": "Master-Slave Read Replicas & Replication Lag: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_read_replicas_sub2",
                    "subskillName": "Master-Slave Read Replicas & Replication Lag: Component Structure & Memory",
                    "prerequisites": [
                      "sd_read_replicas_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_read_replicas_sub3",
                    "subskillName": "Master-Slave Read Replicas & Replication Lag: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_read_replicas_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_read_replicas_sub4",
                    "subskillName": "Master-Slave Read Replicas & Replication Lag: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_read_replicas_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_read_replicas_sub5",
                    "subskillName": "Master-Slave Read Replicas & Replication Lag: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_read_replicas_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_read_replicas_sub6",
                    "subskillName": "Master-Slave Read Replicas & Replication Lag: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_read_replicas_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "system_design_sub_intermediate_2",
            "name": "Database Horizontal Sharding & Core Concepts",
            "skills": [
              {
                "skillId": "sd_sharding_cap_theorem",
                "skillName": "Database Horizontal Sharding & CAP Theorem",
                "prerequisites": [
                  "sd_read_replicas"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_sharding_cap_theorem_sub1",
                    "subskillName": "Database Horizontal Sharding & CAP Theorem: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_sharding_cap_theorem_sub2",
                    "subskillName": "Database Horizontal Sharding & CAP Theorem: Component Structure & Memory",
                    "prerequisites": [
                      "sd_sharding_cap_theorem_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_sharding_cap_theorem_sub3",
                    "subskillName": "Database Horizontal Sharding & CAP Theorem: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_sharding_cap_theorem_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_sharding_cap_theorem_sub4",
                    "subskillName": "Database Horizontal Sharding & CAP Theorem: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_sharding_cap_theorem_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_sharding_cap_theorem_sub5",
                    "subskillName": "Database Horizontal Sharding & CAP Theorem: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_sharding_cap_theorem_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_sharding_cap_theorem_sub6",
                    "subskillName": "Database Horizontal Sharding & CAP Theorem: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_sharding_cap_theorem_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_rabbitmq_queues",
                "skillName": "Message Queues (RabbitMQ & Task Deferral)",
                "prerequisites": [
                  "sd_sharding_cap_theorem"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_rabbitmq_queues_sub1",
                    "subskillName": "Message Queues (RabbitMQ & Task Deferral): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rabbitmq_queues_sub2",
                    "subskillName": "Message Queues (RabbitMQ & Task Deferral): Component Structure & Memory",
                    "prerequisites": [
                      "sd_rabbitmq_queues_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rabbitmq_queues_sub3",
                    "subskillName": "Message Queues (RabbitMQ & Task Deferral): Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_rabbitmq_queues_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rabbitmq_queues_sub4",
                    "subskillName": "Message Queues (RabbitMQ & Task Deferral): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_rabbitmq_queues_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rabbitmq_queues_sub5",
                    "subskillName": "Message Queues (RabbitMQ & Task Deferral): Integration & Placement Questions",
                    "prerequisites": [
                      "sd_rabbitmq_queues_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_rabbitmq_queues_sub6",
                    "subskillName": "Message Queues (RabbitMQ & Task Deferral): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_rabbitmq_queues_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_cap_pacelc_tradeoffs",
                "skillName": "CAP Theorem & PACELC Distributed Guarantees",
                "prerequisites": [
                  "sd_sharding_cap_theorem"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_cap_pacelc_tradeoffs_sub1",
                    "subskillName": "CAP Theorem & PACELC Distributed Guarantees: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cap_pacelc_tradeoffs_sub2",
                    "subskillName": "CAP Theorem & PACELC Distributed Guarantees: Component Structure & Memory",
                    "prerequisites": [
                      "sd_cap_pacelc_tradeoffs_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cap_pacelc_tradeoffs_sub3",
                    "subskillName": "CAP Theorem & PACELC Distributed Guarantees: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_cap_pacelc_tradeoffs_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cap_pacelc_tradeoffs_sub4",
                    "subskillName": "CAP Theorem & PACELC Distributed Guarantees: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_cap_pacelc_tradeoffs_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cap_pacelc_tradeoffs_sub5",
                    "subskillName": "CAP Theorem & PACELC Distributed Guarantees: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_cap_pacelc_tradeoffs_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cap_pacelc_tradeoffs_sub6",
                    "subskillName": "CAP Theorem & PACELC Distributed Guarantees: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_cap_pacelc_tradeoffs_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_database_partitioning_sharding",
                "skillName": "Horizontal Sharding, Range-Based vs Hash-Based Keys",
                "prerequisites": [
                  "sd_sharding_cap_theorem"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_database_partitioning_sharding_sub1",
                    "subskillName": "Horizontal Sharding, Range-Based vs Hash-Based Keys: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_partitioning_sharding_sub2",
                    "subskillName": "Horizontal Sharding, Range-Based vs Hash-Based Keys: Component Structure & Memory",
                    "prerequisites": [
                      "sd_database_partitioning_sharding_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_partitioning_sharding_sub3",
                    "subskillName": "Horizontal Sharding, Range-Based vs Hash-Based Keys: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_database_partitioning_sharding_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_partitioning_sharding_sub4",
                    "subskillName": "Horizontal Sharding, Range-Based vs Hash-Based Keys: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_database_partitioning_sharding_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_partitioning_sharding_sub5",
                    "subskillName": "Horizontal Sharding, Range-Based vs Hash-Based Keys: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_database_partitioning_sharding_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_database_partitioning_sharding_sub6",
                    "subskillName": "Horizontal Sharding, Range-Based vs Hash-Based Keys: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_database_partitioning_sharding_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "system_design_sub_intermediate_3",
            "name": "Kafka Partitioning, Consumer Groups & Core Concepts",
            "skills": [
              {
                "skillId": "sd_message_brokers_kafka",
                "skillName": "Kafka Partitioning, Consumer Groups & Exactly-Once Semantics",
                "prerequisites": [
                  "sd_rabbitmq_queues"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_message_brokers_kafka_sub1",
                    "subskillName": "Kafka Partitioning, Consumer Groups & Exactly-Once Semantics: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_message_brokers_kafka_sub2",
                    "subskillName": "Kafka Partitioning, Consumer Groups & Exactly-Once Semantics: Component Structure & Memory",
                    "prerequisites": [
                      "sd_message_brokers_kafka_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_message_brokers_kafka_sub3",
                    "subskillName": "Kafka Partitioning, Consumer Groups & Exactly-Once Semantics: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_message_brokers_kafka_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_message_brokers_kafka_sub4",
                    "subskillName": "Kafka Partitioning, Consumer Groups & Exactly-Once Semantics: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_message_brokers_kafka_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_message_brokers_kafka_sub5",
                    "subskillName": "Kafka Partitioning, Consumer Groups & Exactly-Once Semantics: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_message_brokers_kafka_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_message_brokers_kafka_sub6",
                    "subskillName": "Kafka Partitioning, Consumer Groups & Exactly-Once Semantics: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_message_brokers_kafka_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_distributed_id_generation",
                "skillName": "Distributed Unique ID Generators: Twitter Snowflake Design",
                "prerequisites": [
                  "sd_consistent_hashing"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_distributed_id_generation_sub1",
                    "subskillName": "Distributed Unique ID Generators: Twitter Snowflake Design: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_id_generation_sub2",
                    "subskillName": "Distributed Unique ID Generators: Twitter Snowflake Design: Component Structure & Memory",
                    "prerequisites": [
                      "sd_distributed_id_generation_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_id_generation_sub3",
                    "subskillName": "Distributed Unique ID Generators: Twitter Snowflake Design: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_distributed_id_generation_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_id_generation_sub4",
                    "subskillName": "Distributed Unique ID Generators: Twitter Snowflake Design: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_distributed_id_generation_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_id_generation_sub5",
                    "subskillName": "Distributed Unique ID Generators: Twitter Snowflake Design: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_distributed_id_generation_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_id_generation_sub6",
                    "subskillName": "Distributed Unique ID Generators: Twitter Snowflake Design: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_distributed_id_generation_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_search_indexing_elasticsearch",
                "skillName": "Inverted Indexing & Distributed Search with Elasticsearch",
                "prerequisites": [
                  "sd_redis_cache_aside"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_search_indexing_elasticsearch_sub1",
                    "subskillName": "Inverted Indexing & Distributed Search with Elasticsearch: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_search_indexing_elasticsearch_sub2",
                    "subskillName": "Inverted Indexing & Distributed Search with Elasticsearch: Component Structure & Memory",
                    "prerequisites": [
                      "sd_search_indexing_elasticsearch_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_search_indexing_elasticsearch_sub3",
                    "subskillName": "Inverted Indexing & Distributed Search with Elasticsearch: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_search_indexing_elasticsearch_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_search_indexing_elasticsearch_sub4",
                    "subskillName": "Inverted Indexing & Distributed Search with Elasticsearch: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_search_indexing_elasticsearch_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_search_indexing_elasticsearch_sub5",
                    "subskillName": "Inverted Indexing & Distributed Search with Elasticsearch: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_search_indexing_elasticsearch_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_search_indexing_elasticsearch_sub6",
                    "subskillName": "Inverted Indexing & Distributed Search with Elasticsearch: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_search_indexing_elasticsearch_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_websocket_realtime_clusters",
                "skillName": "Real-Time WebSocket Gateway Clustering & Redis Pub/Sub",
                "prerequisites": [
                  "sd_rabbitmq_queues"
                ],
                "difficulty": "INTERMEDIATE",
                "estimatedHours": 6,
                "subskills": [
                  {
                    "subskillId": "sd_websocket_realtime_clusters_sub1",
                    "subskillName": "Real-Time WebSocket Gateway Clustering & Redis Pub/Sub: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_websocket_realtime_clusters_sub2",
                    "subskillName": "Real-Time WebSocket Gateway Clustering & Redis Pub/Sub: Component Structure & Memory",
                    "prerequisites": [
                      "sd_websocket_realtime_clusters_sub1"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_websocket_realtime_clusters_sub3",
                    "subskillName": "Real-Time WebSocket Gateway Clustering & Redis Pub/Sub: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_websocket_realtime_clusters_sub2"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_websocket_realtime_clusters_sub4",
                    "subskillName": "Real-Time WebSocket Gateway Clustering & Redis Pub/Sub: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_websocket_realtime_clusters_sub3"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_websocket_realtime_clusters_sub5",
                    "subskillName": "Real-Time WebSocket Gateway Clustering & Redis Pub/Sub: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_websocket_realtime_clusters_sub4"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_websocket_realtime_clusters_sub6",
                    "subskillName": "Real-Time WebSocket Gateway Clustering & Redis Pub/Sub: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_websocket_realtime_clusters_sub5"
                    ],
                    "difficulty": "INTERMEDIATE",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "system_design_top_advanced",
        "name": "System Design & Distributed Architecture — Advanced Tier",
        "subtopics": [
          {
            "id": "system_design_sub_advanced_1",
            "name": "Event Streaming (Apache Kafka Partitioning) & Core Concepts",
            "skills": [
              {
                "skillId": "sd_kafka_streaming",
                "skillName": "Event Streaming (Apache Kafka Partitioning)",
                "prerequisites": [
                  "sd_rabbitmq_queues"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_kafka_streaming_sub1",
                    "subskillName": "Event Streaming (Apache Kafka Partitioning): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_kafka_streaming_sub2",
                    "subskillName": "Event Streaming (Apache Kafka Partitioning): Component Structure & Memory",
                    "prerequisites": [
                      "sd_kafka_streaming_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_kafka_streaming_sub3",
                    "subskillName": "Event Streaming (Apache Kafka Partitioning): Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_kafka_streaming_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_kafka_streaming_sub4",
                    "subskillName": "Event Streaming (Apache Kafka Partitioning): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_kafka_streaming_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_kafka_streaming_sub5",
                    "subskillName": "Event Streaming (Apache Kafka Partitioning): Integration & Placement Questions",
                    "prerequisites": [
                      "sd_kafka_streaming_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_kafka_streaming_sub6",
                    "subskillName": "Event Streaming (Apache Kafka Partitioning): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_kafka_streaming_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_consensus_raft",
                "skillName": "Consensus Algorithms (Raft Protocol)",
                "prerequisites": [
                  "sd_kafka_streaming"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_consensus_raft_sub1",
                    "subskillName": "Consensus Algorithms (Raft Protocol): Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consensus_raft_sub2",
                    "subskillName": "Consensus Algorithms (Raft Protocol): Component Structure & Memory",
                    "prerequisites": [
                      "sd_consensus_raft_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consensus_raft_sub3",
                    "subskillName": "Consensus Algorithms (Raft Protocol): Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_consensus_raft_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consensus_raft_sub4",
                    "subskillName": "Consensus Algorithms (Raft Protocol): Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_consensus_raft_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consensus_raft_sub5",
                    "subskillName": "Consensus Algorithms (Raft Protocol): Integration & Placement Questions",
                    "prerequisites": [
                      "sd_consensus_raft_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_consensus_raft_sub6",
                    "subskillName": "Consensus Algorithms (Raft Protocol): Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_consensus_raft_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_distributed_locks",
                "skillName": "Distributed Locking & Saga Transactions",
                "prerequisites": [
                  "sd_consensus_raft"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_distributed_locks_sub1",
                    "subskillName": "Distributed Locking & Saga Transactions: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_locks_sub2",
                    "subskillName": "Distributed Locking & Saga Transactions: Component Structure & Memory",
                    "prerequisites": [
                      "sd_distributed_locks_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_locks_sub3",
                    "subskillName": "Distributed Locking & Saga Transactions: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_distributed_locks_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_locks_sub4",
                    "subskillName": "Distributed Locking & Saga Transactions: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_distributed_locks_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_locks_sub5",
                    "subskillName": "Distributed Locking & Saga Transactions: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_distributed_locks_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_distributed_locks_sub6",
                    "subskillName": "Distributed Locking & Saga Transactions: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_distributed_locks_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_service_mesh",
                "skillName": "Service Mesh (Istio) & Circuit Breakers",
                "prerequisites": [
                  "sd_distributed_locks"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_service_mesh_sub1",
                    "subskillName": "Service Mesh (Istio) & Circuit Breakers: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_service_mesh_sub2",
                    "subskillName": "Service Mesh (Istio) & Circuit Breakers: Component Structure & Memory",
                    "prerequisites": [
                      "sd_service_mesh_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_service_mesh_sub3",
                    "subskillName": "Service Mesh (Istio) & Circuit Breakers: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_service_mesh_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_service_mesh_sub4",
                    "subskillName": "Service Mesh (Istio) & Circuit Breakers: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_service_mesh_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_service_mesh_sub5",
                    "subskillName": "Service Mesh (Istio) & Circuit Breakers: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_service_mesh_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_service_mesh_sub6",
                    "subskillName": "Service Mesh (Istio) & Circuit Breakers: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_service_mesh_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "system_design_sub_advanced_2",
            "name": "API Gateway Routing & Core Concepts",
            "skills": [
              {
                "skillId": "sd_api_gateway_capstone",
                "skillName": "API Gateway Routing & System Design Capstone",
                "prerequisites": [
                  "sd_service_mesh"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_api_gateway_capstone_sub1",
                    "subskillName": "API Gateway Routing & System Design Capstone: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_gateway_capstone_sub2",
                    "subskillName": "API Gateway Routing & System Design Capstone: Component Structure & Memory",
                    "prerequisites": [
                      "sd_api_gateway_capstone_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_gateway_capstone_sub3",
                    "subskillName": "API Gateway Routing & System Design Capstone: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_api_gateway_capstone_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_gateway_capstone_sub4",
                    "subskillName": "API Gateway Routing & System Design Capstone: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_api_gateway_capstone_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_gateway_capstone_sub5",
                    "subskillName": "API Gateway Routing & System Design Capstone: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_api_gateway_capstone_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_api_gateway_capstone_sub6",
                    "subskillName": "API Gateway Routing & System Design Capstone: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_api_gateway_capstone_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_two_phase_commit_saga",
                "skillName": "Distributed Transactions: Two-Phase Commit & Saga Orchestration",
                "prerequisites": [
                  "sd_distributed_locks"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_two_phase_commit_saga_sub1",
                    "subskillName": "Distributed Transactions: Two-Phase Commit & Saga Orchestration: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_two_phase_commit_saga_sub2",
                    "subskillName": "Distributed Transactions: Two-Phase Commit & Saga Orchestration: Component Structure & Memory",
                    "prerequisites": [
                      "sd_two_phase_commit_saga_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_two_phase_commit_saga_sub3",
                    "subskillName": "Distributed Transactions: Two-Phase Commit & Saga Orchestration: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_two_phase_commit_saga_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_two_phase_commit_saga_sub4",
                    "subskillName": "Distributed Transactions: Two-Phase Commit & Saga Orchestration: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_two_phase_commit_saga_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_two_phase_commit_saga_sub5",
                    "subskillName": "Distributed Transactions: Two-Phase Commit & Saga Orchestration: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_two_phase_commit_saga_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_two_phase_commit_saga_sub6",
                    "subskillName": "Distributed Transactions: Two-Phase Commit & Saga Orchestration: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_two_phase_commit_saga_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_cqrs_event_sourcing",
                "skillName": "Command Query Responsibility Segregation (CQRS) & Event Sourcing",
                "prerequisites": [
                  "sd_kafka_streaming"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_cqrs_event_sourcing_sub1",
                    "subskillName": "Command Query Responsibility Segregation (CQRS) & Event Sourcing: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cqrs_event_sourcing_sub2",
                    "subskillName": "Command Query Responsibility Segregation (CQRS) & Event Sourcing: Component Structure & Memory",
                    "prerequisites": [
                      "sd_cqrs_event_sourcing_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cqrs_event_sourcing_sub3",
                    "subskillName": "Command Query Responsibility Segregation (CQRS) & Event Sourcing: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_cqrs_event_sourcing_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cqrs_event_sourcing_sub4",
                    "subskillName": "Command Query Responsibility Segregation (CQRS) & Event Sourcing: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_cqrs_event_sourcing_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cqrs_event_sourcing_sub5",
                    "subskillName": "Command Query Responsibility Segregation (CQRS) & Event Sourcing: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_cqrs_event_sourcing_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_cqrs_event_sourcing_sub6",
                    "subskillName": "Command Query Responsibility Segregation (CQRS) & Event Sourcing: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_cqrs_event_sourcing_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_design_distributed_cache",
                "skillName": "Designing a Distributed In-Memory Cache from Scratch",
                "prerequisites": [
                  "sd_consensus_raft"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_design_distributed_cache_sub1",
                    "subskillName": "Designing a Distributed In-Memory Cache from Scratch: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_distributed_cache_sub2",
                    "subskillName": "Designing a Distributed In-Memory Cache from Scratch: Component Structure & Memory",
                    "prerequisites": [
                      "sd_design_distributed_cache_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_distributed_cache_sub3",
                    "subskillName": "Designing a Distributed In-Memory Cache from Scratch: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_design_distributed_cache_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_distributed_cache_sub4",
                    "subskillName": "Designing a Distributed In-Memory Cache from Scratch: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_design_distributed_cache_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_distributed_cache_sub5",
                    "subskillName": "Designing a Distributed In-Memory Cache from Scratch: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_design_distributed_cache_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_distributed_cache_sub6",
                    "subskillName": "Designing a Distributed In-Memory Cache from Scratch: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_design_distributed_cache_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          },
          {
            "id": "system_design_sub_advanced_3",
            "name": "Designing High-Scale URL Shortener with 100M Daily Requests & Core Concepts",
            "skills": [
              {
                "skillId": "sd_design_url_shortener_scale",
                "skillName": "Designing High-Scale URL Shortener with 100M Daily Requests",
                "prerequisites": [
                  "sd_kafka_streaming"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_design_url_shortener_scale_sub1",
                    "subskillName": "Designing High-Scale URL Shortener with 100M Daily Requests: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_url_shortener_scale_sub2",
                    "subskillName": "Designing High-Scale URL Shortener with 100M Daily Requests: Component Structure & Memory",
                    "prerequisites": [
                      "sd_design_url_shortener_scale_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_url_shortener_scale_sub3",
                    "subskillName": "Designing High-Scale URL Shortener with 100M Daily Requests: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_design_url_shortener_scale_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_url_shortener_scale_sub4",
                    "subskillName": "Designing High-Scale URL Shortener with 100M Daily Requests: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_design_url_shortener_scale_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_url_shortener_scale_sub5",
                    "subskillName": "Designing High-Scale URL Shortener with 100M Daily Requests: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_design_url_shortener_scale_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_url_shortener_scale_sub6",
                    "subskillName": "Designing High-Scale URL Shortener with 100M Daily Requests: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_design_url_shortener_scale_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_design_video_streaming_youtube",
                "skillName": "High-Scale Video Transcoding & Chunked Adaptive Streaming",
                "prerequisites": [
                  "sd_service_mesh"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_design_video_streaming_youtube_sub1",
                    "subskillName": "High-Scale Video Transcoding & Chunked Adaptive Streaming: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_video_streaming_youtube_sub2",
                    "subskillName": "High-Scale Video Transcoding & Chunked Adaptive Streaming: Component Structure & Memory",
                    "prerequisites": [
                      "sd_design_video_streaming_youtube_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_video_streaming_youtube_sub3",
                    "subskillName": "High-Scale Video Transcoding & Chunked Adaptive Streaming: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_design_video_streaming_youtube_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_video_streaming_youtube_sub4",
                    "subskillName": "High-Scale Video Transcoding & Chunked Adaptive Streaming: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_design_video_streaming_youtube_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_video_streaming_youtube_sub5",
                    "subskillName": "High-Scale Video Transcoding & Chunked Adaptive Streaming: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_design_video_streaming_youtube_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_video_streaming_youtube_sub6",
                    "subskillName": "High-Scale Video Transcoding & Chunked Adaptive Streaming: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_design_video_streaming_youtube_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_design_chat_whatsapp",
                "skillName": "End-to-End Encrypted Real-Time Chat System Architecture",
                "prerequisites": [
                  "sd_distributed_locks"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_design_chat_whatsapp_sub1",
                    "subskillName": "End-to-End Encrypted Real-Time Chat System Architecture: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_chat_whatsapp_sub2",
                    "subskillName": "End-to-End Encrypted Real-Time Chat System Architecture: Component Structure & Memory",
                    "prerequisites": [
                      "sd_design_chat_whatsapp_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_chat_whatsapp_sub3",
                    "subskillName": "End-to-End Encrypted Real-Time Chat System Architecture: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_design_chat_whatsapp_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_chat_whatsapp_sub4",
                    "subskillName": "End-to-End Encrypted Real-Time Chat System Architecture: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_design_chat_whatsapp_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_chat_whatsapp_sub5",
                    "subskillName": "End-to-End Encrypted Real-Time Chat System Architecture: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_design_chat_whatsapp_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_design_chat_whatsapp_sub6",
                    "subskillName": "End-to-End Encrypted Real-Time Chat System Architecture: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_design_chat_whatsapp_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              },
              {
                "skillId": "sd_chaos_resilience_multi_region",
                "skillName": "Chaos Engineering, Circuit Breakers & Multi-Region Failover",
                "prerequisites": [
                  "sd_api_gateway_capstone"
                ],
                "difficulty": "ADVANCED",
                "estimatedHours": 8,
                "subskills": [
                  {
                    "subskillId": "sd_chaos_resilience_multi_region_sub1",
                    "subskillName": "Chaos Engineering, Circuit Breakers & Multi-Region Failover: Core Principles & Syntax",
                    "prerequisites": [],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_chaos_resilience_multi_region_sub2",
                    "subskillName": "Chaos Engineering, Circuit Breakers & Multi-Region Failover: Component Structure & Memory",
                    "prerequisites": [
                      "sd_chaos_resilience_multi_region_sub1"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_chaos_resilience_multi_region_sub3",
                    "subskillName": "Chaos Engineering, Circuit Breakers & Multi-Region Failover: Implementation Patterns & Flow",
                    "prerequisites": [
                      "sd_chaos_resilience_multi_region_sub2"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_chaos_resilience_multi_region_sub4",
                    "subskillName": "Chaos Engineering, Circuit Breakers & Multi-Region Failover: Edge Cases & Practical Exercises",
                    "prerequisites": [
                      "sd_chaos_resilience_multi_region_sub3"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_chaos_resilience_multi_region_sub5",
                    "subskillName": "Chaos Engineering, Circuit Breakers & Multi-Region Failover: Integration & Placement Questions",
                    "prerequisites": [
                      "sd_chaos_resilience_multi_region_sub4"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  },
                  {
                    "subskillId": "sd_chaos_resilience_multi_region_sub6",
                    "subskillName": "Chaos Engineering, Circuit Breakers & Multi-Region Failover: Hands-on Project & Evaluation",
                    "prerequisites": [
                      "sd_chaos_resilience_multi_region_sub5"
                    ],
                    "difficulty": "ADVANCED",
                    "estimatedMinutes": 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Centralized Domain Metadata Configuration
 */
const DOMAIN_CONFIG = {
  fullstack: { id: 'fullstack', displayName: 'Full-Stack Web Development' },
  datascience: { id: 'datascience', displayName: 'Data Science & Machine Learning' },
  devops: { id: 'devops', displayName: 'Cloud Engineering & DevOps' },
  cybersecurity: { id: 'cybersecurity', displayName: 'Cybersecurity & Ethical Hacking' },
  mobile: { id: 'mobile', displayName: 'Mobile App Development (React Native & Flutter)' },
  dsa: { id: 'dsa', displayName: 'Data Structures & Algorithms (Interview Prep)' },
  ai_llm: { id: 'ai_llm', displayName: 'AI & LLM Systems Engineering' },
  system_design: { id: 'system_design', displayName: 'System Design & Distributed Architecture' }
};

/**
 * Normalizes domain key
 */
function normalizeDomainKey(rawDomain) {
  if (!rawDomain || typeof rawDomain !== 'string') return 'fullstack';
  const clean = rawDomain.trim().toLowerCase();
  if (clean.includes('datascience') || clean.includes('data science') || clean.includes('machine learning') || clean.includes('analytics')) return 'datascience';
  if (clean.includes('dsa') || clean.includes('algorithm') || clean.includes('data structure') || clean.includes('interview prep')) return 'dsa';
  if (clean.includes('devops') || clean.includes('cloud')) return 'devops';
  if (clean.includes('cyber') || clean.includes('security') || clean.includes('hacking')) return 'cybersecurity';
  if (clean.includes('mobile') || clean.includes('react native') || clean.includes('flutter') || clean.includes('ios') || clean.includes('android')) return 'mobile';
  if (clean.includes('ai') || clean.includes('llm') || clean.includes('genai') || clean.includes('rag')) return 'ai_llm';
  if (clean.includes('system design') || clean.includes('system_design') || clean.includes('architecture') || clean.includes('distributed')) return 'system_design';
  return 'fullstack';
}

/**
 * Returns Knowledge Graph for given domain (with dynamic fallback generator for arbitrary domains)
 */
function getKnowledgeGraph(rawDomain) {
  const domainKey = normalizeDomainKey(rawDomain);
  if (DOMAIN_KNOWLEDGE_GRAPHS[domainKey]) {
    return DOMAIN_KNOWLEDGE_GRAPHS[domainKey];
  }

  // Dynamic Graph Generator fallback for arbitrary domains
  const sanitizedDomain = (rawDomain || 'Technology').trim();
  return {
    domainId: domainKey,
    domainName: sanitizedDomain,
    topics: [
      {
        id: `${domainKey}_topic_fund`,
        name: `${sanitizedDomain} Fundamentals`,
        subtopics: [
          {
            id: `${domainKey}_sub_basics`,
            name: 'Core Concepts & Tooling',
            skills: [
              {
                skillId: `${domainKey}_basics`,
                skillName: `${sanitizedDomain} Core Principles`,
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: `${domainKey}_sub_concept1`, subskillName: `${sanitizedDomain} Foundation Overview`, skillName: `${sanitizedDomain} Foundation Overview`, prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: `${domainKey}_sub_concept2`, subskillName: `${sanitizedDomain} Applied Syntax`, skillName: `${sanitizedDomain} Applied Syntax`, prerequisites: [`${domainKey}_sub_concept1`], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Flatten all skills in a Knowledge Graph into an array
 */
function getAllSkillsInGraph(graph) {
  const skills = [];
  if (!graph || !Array.isArray(graph.topics)) return skills;

  graph.topics.forEach(t => {
    if (Array.isArray(t.subtopics)) {
      t.subtopics.forEach(s => {
        if (Array.isArray(s.skills)) {
          s.skills.forEach(sk => {
            skills.push({
              ...sk,
              topicId: t.id,
              topicName: t.name,
              subtopicId: s.id,
              subtopicName: s.name,
              domain: graph.domainName
            });
          });
        }
      });
    }
  });

  return skills;
}

/**
 * Topologically sort skills based on prerequisites (DAG sort)
 */
function topologicalSortSkills(skills) {
  const skillMap = new Map();
  skills.forEach(s => skillMap.set(s.skillId, s));

  const visited = new Set();
  const sorted = [];
  const tempMark = new Set();

  function visit(skillId) {
    if (tempMark.has(skillId)) return; // Avoid circular deadlock
    if (!visited.has(skillId)) {
      tempMark.add(skillId);
      const sk = skillMap.get(skillId);
      if (sk && Array.isArray(sk.prerequisites)) {
        sk.prerequisites.forEach(prereqId => {
          if (skillMap.has(prereqId)) {
            visit(prereqId);
          }
        });
      }
      tempMark.delete(skillId);
      visited.add(skillId);
      if (sk) sorted.push(sk);
    }
  }

  skills.forEach(s => {
    if (!visited.has(s.skillId)) {
      visit(s.skillId);
    }
  });

  return sorted;
}

/**
 * Returns ordered subskills for a skill node, guaranteeing at least 6 unique concepts for Days 1-6
 */
function getOrderedSubskillsForSkill(skillNode) {
  if (!skillNode) {
    return [
      { subskillId: 'sk_sub1', subskillName: 'Core Concept: Structure & Syntax', skillName: 'Core Concept: Structure & Syntax', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
      { subskillId: 'sk_sub2', subskillName: 'Core Concept: Variable & Types', skillName: 'Core Concept: Variable & Types', prerequisites: ['sk_sub1'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
      { subskillId: 'sk_sub3', subskillName: 'Core Concept: Logical Operations', skillName: 'Core Concept: Logical Operations', prerequisites: ['sk_sub2'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
      { subskillId: 'sk_sub4', subskillName: 'Core Concept: Functions & Scope', skillName: 'Core Concept: Functions & Scope', prerequisites: ['sk_sub3'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
      { subskillId: 'sk_sub5', subskillName: 'Core Concept: Error Handling & Edge Cases', skillName: 'Core Concept: Error Handling & Edge Cases', prerequisites: ['sk_sub4'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
      { subskillId: 'sk_sub6', subskillName: 'Core Concept: Integrated Implementation', skillName: 'Core Concept: Integrated Implementation', prerequisites: ['sk_sub5'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
    ];
  }

  const baseName = skillNode.skillName || skillNode.subtopicName || 'Core Concept';
  const existingSubskills = Array.isArray(skillNode.subskills) ? skillNode.subskills : [];

  const mappedSubskills = existingSubskills.map((sub, idx) => {
    const sName = sub.subskillName || sub.skillName || `${baseName} Part ${idx + 1}`;
    return {
      ...sub,
      subskillId: sub.subskillId || sub.skillId || `${skillNode.skillId}_sub_${idx + 1}`,
      subskillName: sName,
      skillName: sName
    };
  });

  const uniqueSubskills = [];
  const seenNames = new Set();

  mappedSubskills.forEach(s => {
    const cleanName = s.subskillName.trim();
    if (!seenNames.has(cleanName.toLowerCase())) {
      seenNames.add(cleanName.toLowerCase());
      uniqueSubskills.push(s);
    }
  });

  const aspectNames = [
    'Syntax & Foundational Principles',
    'Core Operations & Memory Assignment',
    'Data Representations & Structuring',
    'Logic, Control Flow & Rules',
    'Functions & Advanced Patterns',
    'Integrated Implementation & Practice'
  ];

  while (uniqueSubskills.length < 6) {
    const nextIdx = uniqueSubskills.length + 1;
    const aspect = aspectNames[nextIdx - 1] || `Advanced Skill Aspect ${nextIdx}`;
    const newSubId = `${skillNode.skillId}_sub_${nextIdx}`;
    const newSubName = `${baseName}: ${aspect}`;

    if (!seenNames.has(newSubName.toLowerCase())) {
      seenNames.add(newSubName.toLowerCase());
      uniqueSubskills.push({
        subskillId: newSubId,
        subskillName: newSubName,
        skillName: newSubName,
        prerequisites: uniqueSubskills.length > 0 ? [uniqueSubskills[uniqueSubskills.length - 1].subskillId] : [],
        difficulty: skillNode.difficulty || 'BEGINNER',
        estimatedMinutes: 45
      });
    }
  }

  return uniqueSubskills;
}

module.exports = {
  DOMAIN_KNOWLEDGE_GRAPHS,
  DOMAIN_CONFIG,
  normalizeDomainKey,
  getKnowledgeGraph,
  getAllSkillsInGraph,
  topologicalSortSkills,
  getOrderedSubskillsForSkill
};
