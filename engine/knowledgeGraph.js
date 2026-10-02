/**
 * Knowledge Graph Engine for AgPlacify
 * Domain-independent, prerequisite-aware skill graph structure supporting arbitrary domains.
 * Hierarchy: Domain -> Topics -> Subtopics -> Skills/Concepts -> Subskills -> (Prerequisites, Difficulty, Learning Dependencies)
 */

const DOMAIN_KNOWLEDGE_GRAPHS = {
  fullstack: {
    domainId: 'fullstack',
    domainName: 'Full-Stack Web Development',
    topics: [
      {
        id: 'fs_top_web_fund',
        name: 'Web & HTML/CSS Fundamentals',
        subtopics: [
          {
            id: 'fs_sub_html',
            name: 'HTML5 Foundations',
            skills: [
              {
                skillId: 'web_html_elem',
                skillName: 'HTML5 Semantic Elements',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 3,
                subskills: [
                  { subskillId: 'html_doc_struct', subskillName: 'HTML Document Structure & Boilerplate', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'html_text_formatting', subskillName: 'Headings, Paragraphs & Text Formatting', prerequisites: ['html_doc_struct'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'html_links_nav', subskillName: 'Links, Hyperlinks & Navigation Anchor Tags', prerequisites: ['html_text_formatting'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'html_images_media', subskillName: 'Images, Audio & Embedded Media', prerequisites: ['html_links_nav'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'html_lists_tables', subskillName: 'Ordered, Unordered Lists & Data Tables', prerequisites: ['html_images_media'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'html_forms_inputs', subskillName: 'Forms, Input Controls & Label Attributes', prerequisites: ['html_lists_tables'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'html_semantic_a11y', subskillName: 'Semantic Elements & ARIA Accessibility', prerequisites: ['html_forms_inputs'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'fs_sub_css',
            name: 'CSS Layouts',
            skills: [
              {
                skillId: 'web_css_box',
                skillName: 'CSS Box Model & Flexbox',
                prerequisites: ['web_html_elem'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'css_selectors_rules', subskillName: 'CSS Selectors, Specificity & Cascade', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_box_model', subskillName: 'Box Model: Margin, Border, Padding & Sizing', prerequisites: ['css_selectors_rules'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_flex_container', subskillName: 'Flexbox Container & Main/Cross Axis', prerequisites: ['css_box_model'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_flex_items', subskillName: 'Flex Items Alignment, Grow & Shrink', prerequisites: ['css_flex_container'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_positioning', subskillName: 'CSS Positioning: Relative, Absolute & Fixed', prerequisites: ['css_flex_items'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_typography_colors', subskillName: 'Color Systems, Fonts & Web Typography', prerequisites: ['css_positioning'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'web_css_grid',
                skillName: 'CSS Grid & Responsive Layouts',
                prerequisites: ['web_css_box'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'css_grid_template', subskillName: 'Grid Container & Template Tracks', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_grid_placement', subskillName: 'Grid Item Placement & Span Alignment', prerequisites: ['css_grid_template'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_media_queries', subskillName: 'Media Queries & Breakpoint Strategy', prerequisites: ['css_grid_placement'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'css_responsive_units', subskillName: 'Responsive Units (rem, em, vw, vh, fr)', prerequisites: ['css_media_queries'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'fs_top_js_fund',
        name: 'JavaScript Fundamentals',
        subtopics: [
          {
            id: 'fs_sub_js_syntax',
            name: 'JavaScript Core Syntax',
            skills: [
              {
                skillId: 'js_vars_types',
                skillName: 'JS Variables, Types & Operators',
                prerequisites: ['web_css_box'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'js_vars_const_let', subskillName: 'Variables: var, let & const Scoping', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_primitive_types', subskillName: 'Primitive Types: String, Number, Boolean, null', prerequisites: ['js_vars_const_let'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_operators_math', subskillName: 'Arithmetic, Comparison & Logical Operators', prerequisites: ['js_primitive_types'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_type_conversion', subskillName: 'Explicit & Implicit Type Coercion', prerequisites: ['js_operators_math'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'js_control_flow',
                skillName: 'Control Flow, Loops & Conditionals',
                prerequisites: ['js_vars_types'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'js_if_else_branch', subskillName: 'Conditional Logic: if, else if, switch', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_for_while_loops', subskillName: 'Loops: for, while & do...while Iteration', prerequisites: ['js_if_else_branch'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_break_continue', subskillName: 'Loop Control: break & continue Rules', prerequisites: ['js_for_while_loops'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'fs_sub_js_funcs',
            name: 'Functions & Objects',
            skills: [
              {
                skillId: 'js_funcs_scope',
                skillName: 'JS Functions, Scope & Closures',
                prerequisites: ['js_control_flow'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'js_func_decl_expr', subskillName: 'Function Declarations & Expressions', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_arrow_functions', subskillName: 'Arrow Functions & Lexical Scope', prerequisites: ['js_func_decl_expr'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_scope_closures', subskillName: 'Global/Local Scope & Closures', prerequisites: ['js_arrow_functions'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'js_arrays_objs',
                skillName: 'JS Arrays, Objects & ES6+ Features',
                prerequisites: ['js_funcs_scope'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'js_array_methods', skillName: 'Array Iteration: map, filter, reduce', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_object_literals', skillName: 'Object Literals, Keys & Destructuring', prerequisites: ['js_array_methods'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'js_spread_rest', skillName: 'Spread/Rest Operators & Template Literals', prerequisites: ['js_object_literals'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'fs_top_dom_async',
        name: 'DOM & Async JavaScript',
        subtopics: [
          {
            id: 'fs_sub_dom',
            name: 'DOM Manipulation',
            skills: [
              {
                skillId: 'js_dom_events',
                skillName: 'DOM Selection & Event Handling',
                prerequisites: ['js_arrays_objs'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dom_query_selectors', subskillName: 'DOM Element Selection & Querying', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dom_element_mutation', subskillName: 'Modifying Text, HTML & Attributes', prerequisites: ['dom_query_selectors'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dom_event_listeners', subskillName: 'Event Listeners, Bubbling & Delegation', prerequisites: ['dom_element_mutation'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'fs_sub_async',
            name: 'Async JS & HTTP',
            skills: [
              {
                skillId: 'js_promises_async',
                skillName: 'Promises & Async/Await',
                prerequisites: ['js_dom_events'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'js_callbacks_promises', skillName: 'Callbacks vs Promises Resolution', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'js_async_await_syntax', skillName: 'Async/Await Syntax & Error Handling', prerequisites: ['js_callbacks_promises'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'js_fetch_api',
                skillName: 'Fetch API & AJAX Integration',
                prerequisites: ['js_promises_async'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'fetch_get_post_req', skillName: 'HTTP GET/POST Requests via Fetch API', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'fetch_json_parsing', skillName: 'Parsing JSON Payloads & Network Headers', prerequisites: ['fetch_get_post_req'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'fs_top_react',
        name: 'React UI Architecture',
        subtopics: [
          {
            id: 'fs_sub_react_basics',
            name: 'React Components & Props',
            skills: [
              {
                skillId: 'react_jsx_comps',
                skillName: 'React JSX & Component Hierarchy',
                prerequisites: ['js_fetch_api'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'react_jsx_syntax', skillName: 'JSX Syntax & Embedding Expressions', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'react_functional_comps', skillName: 'Functional Components & Modular UI', prerequisites: ['react_jsx_syntax'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'react_props_state',
                skillName: 'React State & Props Management',
                prerequisites: ['react_jsx_comps'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'react_props_passing', skillName: 'Passing Props & Component Interactivity', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'react_usestate_hook', skillName: 'useState Hook & State Updates', prerequisites: ['react_props_passing'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'fs_sub_react_hooks',
            name: 'React Hooks & State',
            skills: [
              {
                skillId: 'react_hooks_core',
                skillName: 'React Hooks (useState & useEffect)',
                prerequisites: ['react_props_state'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'react_useeffect_fetch', skillName: 'useEffect Hook & Data Fetching', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'react_form_inputs', skillName: 'Controlled Forms & Event Handling', prerequisites: ['react_useeffect_fetch'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'react_router_arch',
                skillName: 'React Router & SPA Architecture',
                prerequisites: ['react_hooks_core'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'react_client_routing', skillName: 'React Router Client-Side Navigation', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'react_global_context', skillName: 'Context API & Global State', prerequisites: ['react_client_routing'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'fs_top_backend',
        name: 'Backend API & Databases',
        subtopics: [
          {
            id: 'fs_sub_express',
            name: 'Node.js & Express',
            skills: [
              {
                skillId: 'node_event_loop',
                skillName: 'Node.js Basics & Event Loop',
                prerequisites: ['js_promises_async'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'node_modules_fs', skillName: 'Node.js Core Modules & File System', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'node_http_server', skillName: 'HTTP Module & Server Setup', prerequisites: ['node_modules_fs'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'express_rest_apis',
                skillName: 'Express Middleware & REST APIs',
                prerequisites: ['node_event_loop'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'express_routing', skillName: 'Express Routing & URL Parameters', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'express_middleware', skillName: 'Middleware Pipelines & Error Handling', prerequisites: ['express_routing'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'fs_sub_db',
            name: 'Databases (SQL & NoSQL)',
            skills: [
              {
                skillId: 'db_sql_relational',
                skillName: 'SQL Database Design & Queries',
                prerequisites: ['express_rest_apis'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'sql_schema_design', skillName: 'Relational Schema & Primary/Foreign Keys', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sql_queries_joins', skillName: 'SELECT Queries, JOINS & Indexing', prerequisites: ['sql_schema_design'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'db_mongo_nosql',
                skillName: 'MongoDB Document Schemas & Mongoose',
                prerequisites: ['express_rest_apis'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'mongo_document_crud', skillName: 'MongoDB Documents & CRUD Operations', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'mongoose_odm_models', skillName: 'Mongoose Schemas & ODM Validation', prerequisites: ['mongo_document_crud'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'fs_top_advanced',
        name: 'Web Security & System Architecture',
        subtopics: [
          {
            id: 'fs_sub_sec',
            name: 'Web Security',
            skills: [
              {
                skillId: 'web_auth_jwt',
                skillName: 'Authentication & JWT Session Security',
                prerequisites: ['db_sql_relational', 'db_mongo_nosql'],
                difficulty: 'ADVANCED',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'auth_password_hashing', skillName: 'Password Hashing (bcrypt/Argon2)', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'auth_jwt_tokens', skillName: 'JWT Signing, Verification & Cookies', prerequisites: ['auth_password_hashing'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'web_owasp_sec',
                skillName: 'XSS, CSRF, SQLi & CORS Security',
                prerequisites: ['web_auth_jwt'],
                difficulty: 'ADVANCED',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sec_xss_prevention', skillName: 'XSS Output Encoding & Sanitization', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sec_sqli_cors', skillName: 'SQLi Parameterization & CORS Headers', prerequisites: ['sec_xss_prevention'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'fs_top_devops',
            name: 'Full-Stack Deployment',
            skills: [
              {
                skillId: 'docker_containers',
                skillName: 'Docker Containerization for Web Apps',
                prerequisites: ['web_owasp_sec'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'dockerfile_builds', skillName: 'Dockerfile Syntax & Multi-Stage Builds', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'docker_compose_setup', skillName: 'Docker Compose Orchestration', prerequisites: ['dockerfile_builds'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'fullstack_deployment',
                skillName: 'CI/CD Pipelines & Cloud Deployment',
                prerequisites: ['docker_containers'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'cicd_github_actions', skillName: 'GitHub Actions CI/CD Pipeline', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'cloud_hosting_prod', skillName: 'Cloud Server Deployment & SSL Setup', prerequisites: ['cicd_github_actions'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  datascience: {
    domainId: 'datascience',
    domainName: 'Data Science & Machine Learning',
    topics: [
      {
        id: 'ds_top_py_fund',
        name: 'Python Fundamentals',
        subtopics: [
          {
            id: 'ds_sub_vars',
            name: 'Python Syntax',
            skills: [
              {
                skillId: 'py_vars_primitives',
                skillName: 'Python Syntax & Primitive Data Types',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 3,
                subskills: [
                  { subskillId: 'py_vars_assign', skillName: 'Variables & Memory Assignment', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'py_data_types', skillName: 'Strings, Integers, Floats & Booleans', prerequisites: ['py_vars_assign'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'py_control_loops',
                skillName: 'Control Flow (if/else, loops)',
                prerequisites: ['py_vars_primitives'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'py_if_conditionals', skillName: 'If, Elif & Else Conditions', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'py_for_while_iter', skillName: 'For & While Loops Iteration', prerequisites: ['py_if_conditionals'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'ds_sub_funcs',
            name: 'Functions & Data Structures',
            skills: [
              {
                skillId: 'py_funcs_modules',
                skillName: 'Python Functions & Scope',
                prerequisites: ['py_control_loops'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'py_func_params_return', skillName: 'Function Arguments & Return Values', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'py_lambda_scope', skillName: 'Lambda Functions & Local/Global Scope', prerequisites: ['py_func_params_return'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'py_structs_lists',
                skillName: 'Python Data Structures (Lists, Dicts, Sets)',
                prerequisites: ['py_funcs_modules'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'py_lists_tuples', skillName: 'List Manipulation & Tuples', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'py_dicts_sets', skillName: 'Dictionaries & Set Operations', prerequisites: ['py_lists_tuples'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ds_top_data_proc',
        name: 'Data Processing & EDA',
        subtopics: [
          {
            id: 'ds_sub_numpy',
            name: 'NumPy Vectorization',
            skills: [
              {
                skillId: 'np_vectorized_ops',
                skillName: 'NumPy Arrays & Linear Math',
                prerequisites: ['py_structs_lists'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'np_array_creation', skillName: 'NumPy Array Creation & Reshaping', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'np_indexing_slicing', skillName: 'NumPy Indexing, Slicing & Broadcasting', prerequisites: ['np_array_creation'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'ds_sub_pandas',
            name: 'Pandas DataFrames',
            skills: [
              {
                skillId: 'pd_df_manipulation',
                skillName: 'Pandas DataFrames & Manipulation',
                prerequisites: ['np_vectorized_ops'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'pd_dataframe_basics', skillName: 'DataFrame Loading, Columns & Indexing', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'pd_filtering_groupby', skillName: 'Data Filtering, GroupBy & Aggregations', prerequisites: ['pd_dataframe_basics'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'pd_cleaning_eda',
                skillName: 'Data Cleaning, Filtering & EDA',
                prerequisites: ['pd_df_manipulation'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'pd_missing_values', skillName: 'Handling Missing Data & Imputation', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'eda_matplotlib_seaborn', skillName: 'EDA Visualizations with Matplotlib & Seaborn', prerequisites: ['pd_missing_values'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ds_top_stats',
        name: 'Statistics & Probability',
        subtopics: [
          {
            id: 'ds_sub_stats',
            name: 'Inferential Statistics',
            skills: [
              {
                skillId: 'stat_desc_inf',
                skillName: 'Descriptive & Inferential Statistics',
                prerequisites: ['pd_cleaning_eda'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'stat_mean_std_dist', skillName: 'Mean, Variance, Std Dev & Distributions', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'stat_prob_bayes', skillName: 'Probability Theory & Bayes Theorem', prerequisites: ['stat_mean_std_dist'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'stat_hyp_testing',
                skillName: 'Hypothesis Testing & p-values',
                prerequisites: ['stat_desc_inf'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'stat_null_alt_hyp', skillName: 'Null/Alternative Hypothesis & Significance', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'stat_ttest_anova', skillName: 't-Tests, ANOVA & Chi-Square Tests', prerequisites: ['stat_null_alt_hyp'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ds_top_ml',
        name: 'Machine Learning Fundamentals',
        subtopics: [
          {
            id: 'ds_sub_supervised',
            name: 'Supervised Learning',
            skills: [
              {
                skillId: 'ml_lin_log_reg',
                skillName: 'Linear & Logistic Regression',
                prerequisites: ['stat_hyp_testing'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'ml_linear_reg_math', skillName: 'Linear Regression Math & Cost Function', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'ml_logistic_reg_cls', skillName: 'Logistic Regression Classification', prerequisites: ['ml_linear_reg_math'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ml_trees_forests',
                skillName: 'Decision Trees & Random Forests',
                prerequisites: ['ml_lin_log_reg'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'ml_decision_tree_split', skillName: 'Decision Tree Splitting (Gini / Entropy)', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'ml_random_forest_bag', skillName: 'Random Forests & Bagging Ensembles', prerequisites: ['ml_decision_tree_split'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'ds_sub_ensembles',
            name: 'Ensembles & Tuning',
            skills: [
              {
                skillId: 'ml_grad_boosting',
                skillName: 'Gradient Boosting (XGBoost/LightGBM)',
                prerequisites: ['ml_trees_forests'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'ml_xgboost_algo', skillName: 'XGBoost Boosting Architecture', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ml_lightgbm_catboost', skillName: 'LightGBM & CatBoost Performance', prerequisites: ['ml_xgboost_algo'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ml_hyper_tuning',
                skillName: 'Hyperparameter Tuning & Cross-Validation',
                prerequisites: ['ml_grad_boosting'],
                difficulty: 'ADVANCED',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'ml_grid_random_search', skillName: 'GridSearch & RandomSearch Optimization', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ml_kfold_cv', skillName: 'Stratified K-Fold Cross-Validation', prerequisites: ['ml_grid_random_search'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ds_top_dl',
        name: 'Deep Learning & NLP',
        subtopics: [
          {
            id: 'ds_sub_nn',
            name: 'Neural Networks',
            skills: [
              {
                skillId: 'dl_ann_backprop',
                skillName: 'Neural Networks & Backpropagation',
                prerequisites: ['ml_hyper_tuning'],
                difficulty: 'ADVANCED',
                estimatedHours: 10,
                subskills: [
                  { subskillId: 'dl_perceptron_dense', skillName: 'Dense Layers & Activation Functions', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dl_backprop_grad', skillName: 'Backpropagation & Gradient Descent', prerequisites: ['dl_perceptron_dense'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dl_cnn_vision',
                skillName: 'CNNs for Computer Vision',
                prerequisites: ['dl_ann_backprop'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'dl_conv_pooling', skillName: 'Convolutional & Pooling Layers', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dl_image_cls', skillName: 'Image Classification Architectures', prerequisites: ['dl_conv_pooling'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          },
          {
            id: 'ds_sub_nlp',
            name: 'Natural Language Processing',
            skills: [
              {
                skillId: 'nlp_transformers_llm',
                skillName: 'Transformers & LLM Fine-Tuning',
                prerequisites: ['dl_cnn_vision'],
                difficulty: 'ADVANCED',
                estimatedHours: 12,
                subskills: [
                  { subskillId: 'nlp_word_embeddings', skillName: 'Word Embeddings & Self-Attention', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'nlp_transformer_bert_gpt', skillName: 'Transformer Encoder/Decoder Models', prerequisites: ['nlp_word_embeddings'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mlops_fastapi_deploy',
                skillName: 'MLOps, Model Serving & FastAPI Deployment',
                prerequisites: ['nlp_transformers_llm'],
                difficulty: 'ADVANCED',
                estimatedHours: 10,
                subskills: [
                  { subskillId: 'mlops_model_pickle', skillName: 'Model Serialization (Pickle/ONNX)', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'mlops_fastapi_serving', skillName: 'FastAPI Serving & Endpoint Monitoring', prerequisites: ['mlops_model_pickle'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  cybersecurity: {
    domainId: 'cybersecurity',
    domainName: 'Cybersecurity & Ethical Hacking',
    topics: [
      {
        id: 'sec_top_cli_net',
        name: 'Computer Systems & CLI Fundamentals',
        subtopics: [
          {
            id: 'sec_sub_sys',
            name: 'Linux CLI & OS Fundamentals',
            skills: [
              {
                skillId: 'sec_linux_cli',
                skillName: 'Linux Command Line & Systems Basics',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'sec_cli_nav', skillName: 'Linux Directory Navigation & Permissions', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'sec_sys_users', skillName: 'User Management & Process Control', prerequisites: ['sec_cli_nav'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sec_win_cli',
                skillName: 'Windows CLI & File Privileges',
                prerequisites: ['sec_linux_cli'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'sec_cmd_powershell', skillName: 'PowerShell & Cmdlet Basics', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'sec_win_acl', skillName: 'Windows ACLs & Security Tokens', prerequisites: ['sec_cmd_powershell'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sec_top_net_traffic',
        name: 'Networking Protocols & Traffic Analysis',
        subtopics: [
          {
            id: 'sec_sub_traffic',
            name: 'Wireshark & Packet Capture',
            skills: [
              {
                skillId: 'sec_net_tcpip',
                skillName: 'Computer Networking & TCP/IP Protocols',
                prerequisites: ['sec_linux_cli'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'sec_ip_subnets', skillName: 'IP Addressing & Subnet Masking', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'sec_tcp_handshake', skillName: 'TCP/IP 3-Way Handshake & Ports', prerequisites: ['sec_ip_subnets'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sec_wireshark_capture',
                skillName: 'Wireshark Packet Inspection & Protocols',
                prerequisites: ['sec_net_tcpip'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'sec_pcap_filters', skillName: 'Wireshark Display Filters & Stream Analysis', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'sec_dns_http_pcap', skillName: 'DNS & HTTP Unencrypted Traffic Inspection', prerequisites: ['sec_pcap_filters'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sec_top_def_firewalls',
        name: 'Network Defense & Firewalls',
        subtopics: [
          {
            id: 'sec_sub_defense',
            name: 'IDS/IPS & Scanning',
            skills: [
              {
                skillId: 'sec_firewalls_ids',
                skillName: 'Firewalls, IDS/IPS & Rule Sets',
                prerequisites: ['sec_wireshark_capture'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sec_iptables_nft', skillName: 'Stateful Firewall Rules & iptables', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sec_snort_suricata', skillName: 'Snort/Suricata Intrusion Detection Signatures', prerequisites: ['sec_iptables_nft'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sec_vpn_nmap',
                skillName: 'Nmap Scanning & VPN Tunneling',
                prerequisites: ['sec_firewalls_ids'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sec_nmap_scripts', skillName: 'Nmap NSE Scripts & Port Discovery', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sec_openvpn_ipsec', skillName: 'OpenVPN & IPsec Encryption Tunnels', prerequisites: ['sec_nmap_scripts'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sec_top_web_sec',
        name: 'Web Application Vulnerabilities',
        subtopics: [
          {
            id: 'sec_sub_owasp',
            name: 'OWASP Top 10 Exploitation',
            skills: [
              {
                skillId: 'sec_owasp_xss',
                skillName: 'Cross-Site Scripting (XSS) & Defenses',
                prerequisites: ['sec_vpn_nmap'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sec_stored_reflected_xss', skillName: 'Stored, Reflected & DOM-based XSS', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sec_csp_headers', skillName: 'Content Security Policy (CSP) & Output Sanitization', prerequisites: ['sec_stored_reflected_xss'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sec_sqli_csrf',
                skillName: 'SQL Injection & CSRF Attacks',
                prerequisites: ['sec_owasp_xss'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sec_sqli_parameterization', skillName: 'SQLi Payloads & Prepared Statements', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sec_csrf_tokens', skillName: 'Anti-CSRF Tokens & SameSite Cookie Protection', prerequisites: ['sec_sqli_parameterization'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sec_top_crypto_pki',
        name: 'Cryptography & PKI Architecture',
        subtopics: [
          {
            id: 'sec_sub_ciphers',
            name: 'Ciphers & Public Keys',
            skills: [
              {
                skillId: 'sec_crypto_ciphers',
                skillName: 'Symmetric & Asymmetric Encryption',
                prerequisites: ['sec_sqli_csrf'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sec_aes_rsa_math', skillName: 'AES-GCM & RSA/ECC Public Key Math', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sec_hashes_hmac', skillName: 'SHA-256 Hashes & HMAC Authentication', prerequisites: ['sec_aes_rsa_math'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sec_pki_tls',
                skillName: 'PKI Certificates & TLS Handshake',
                prerequisites: ['sec_crypto_ciphers'],
                difficulty: 'ADVANCED',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sec_x509_ca', skillName: 'X.509 Certificates & Certificate Authorities', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sec_tls_13_handshake', skillName: 'TLS 1.3 Handshake Protocol & Cipher Suites', prerequisites: ['sec_x509_ca'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sec_top_priv_hardening',
        name: 'System Hardening & Privilege Escalation',
        subtopics: [
          {
            id: 'sec_sub_escalation',
            name: 'Privilege Escalation Defenses',
            skills: [
              {
                skillId: 'sec_sys_hardening',
                skillName: 'Linux/Windows OS Security Hardening',
                prerequisites: ['sec_pki_tls'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'sec_cis_benchmarks', skillName: 'CIS Benchmarks & OS Hardening Policies', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sec_selinux_apparmor', skillName: 'SELinux & AppArmor MAC Protections', prerequisites: ['sec_cis_benchmarks'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sec_priv_esc',
                skillName: 'Active Directory & Privilege Escalation',
                prerequisites: ['sec_sys_hardening'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'sec_sudo_suid_priv', skillName: 'Linux SUID & Sudo Misconfiguration Auditing', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sec_ad_kerberoasting', skillName: 'Active Directory Kerberoasting & RBAC Defenses', prerequisites: ['sec_sudo_suid_priv'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sec_top_ir_forensics',
        name: 'Incident Response & Forensics Capstone',
        subtopics: [
          {
            id: 'sec_sub_forensics',
            name: 'SIEM & Threat Hunting',
            skills: [
              {
                skillId: 'sec_siem_splunk',
                skillName: 'SIEM Log Analysis & Splunk Queries',
                prerequisites: ['sec_priv_esc'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'sec_log_correlation', skillName: 'Syslog & Event ID Log Correlation', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sec_splunk_spl_search', skillName: 'Splunk SPL Queries & Alert Rules', prerequisites: ['sec_log_correlation'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sec_forensics_capstone',
                skillName: 'Memory Forensics & Incident Response Capstone',
                prerequisites: ['sec_siem_splunk'],
                difficulty: 'ADVANCED',
                estimatedHours: 10,
                subskills: [
                  { subskillId: 'sec_volatility_memory', skillName: 'Volatility Memory Dump Analysis', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sec_ir_playbook_exec', skillName: 'Incident Response Playbook Execution', prerequisites: ['sec_volatility_memory'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  devops: {
    domainId: 'devops',
    domainName: 'Cloud Engineering & DevOps',
    topics: [
      {
        id: 'dev_top_net_os',
        name: 'Computer Networking & OS Basics',
        subtopics: [
          {
            id: 'dev_sub_os_net',
            name: 'Linux Filesystem & Network Basics',
            skills: [
              {
                skillId: 'dev_os_net_basics',
                skillName: 'OS Architecture & Networking Protocols',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'dev_os_architecture', skillName: 'Linux Kernel & File System Navigation', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dev_tcpip_dns_http', skillName: 'TCP/IP, DNS, HTTP & SSH Connections', prerequisites: ['dev_os_architecture'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dev_linux_files',
                skillName: 'Linux File System & Permissions',
                prerequisites: ['dev_os_net_basics'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'dev_chmod_chown_perm', skillName: 'File Ownership & chmod/chown Privileges', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dev_symlinks_storage', skillName: 'Symbolic Links & Disk Storage Partitioning', prerequisites: ['dev_chmod_chown_perm'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dev_top_shell_admin',
        name: 'Linux Administration & Shell',
        subtopics: [
          {
            id: 'dev_sub_admin',
            name: 'Systemd & Automation',
            skills: [
              {
                skillId: 'dev_systemd_services',
                skillName: 'Systemd Service Configuration & Process Mgmt',
                prerequisites: ['dev_linux_files'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dev_ps_top_kill', skillName: 'Process Monitoring (ps, top, htop, kill)', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dev_systemctl_units', skillName: 'Writing Systemd Unit Files & Services', prerequisites: ['dev_ps_top_kill'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dev_shell_scripting',
                skillName: 'Bash Shell Scripting & Automation',
                prerequisites: ['dev_systemd_services'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dev_bash_vars_control', skillName: 'Bash Variables, Conditionals & Loops', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dev_cron_jobs_auto', skillName: 'Cron Automation & Network Utilities (curl/ss)', prerequisites: ['dev_bash_vars_control'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dev_top_docker_containers',
        name: 'Containerization & Docker',
        subtopics: [
          {
            id: 'dev_sub_docker',
            name: 'Docker Images & Compose',
            skills: [
              {
                skillId: 'dev_dockerfile_builds',
                skillName: 'Dockerfile Optimization & Multi-Stage Builds',
                prerequisites: ['dev_shell_scripting'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'dev_docker_layers_cache', skillName: 'Docker Layer Caching & Base Images', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dev_multistage_distroless', skillName: 'Multi-Stage Dockerfiles & Distroless Images', prerequisites: ['dev_docker_layers_cache'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dev_docker_compose',
                skillName: 'Docker Compose & Multi-Container Networking',
                prerequisites: ['dev_dockerfile_builds'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'dev_compose_yaml_spec', skillName: 'Docker Compose Services & Volumes', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dev_bridge_networks', skillName: 'Bridge Networks & Container DNS Resolution', prerequisites: ['dev_compose_yaml_spec'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dev_top_cicd_automation',
        name: 'CI/CD Automation & Pipelines',
        subtopics: [
          {
            id: 'dev_sub_cicd',
            name: 'GitHub Actions & Deployment',
            skills: [
              {
                skillId: 'dev_git_workflows',
                skillName: 'Git Branching & Release Management',
                prerequisites: ['dev_docker_compose'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dev_git_flow_rebase', skillName: 'Git Flow Strategy & Interactive Rebase', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dev_semantic_versioning', skillName: 'Semantic Versioning & Git Tags', prerequisites: ['dev_git_flow_rebase'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dev_github_actions',
                skillName: 'GitHub Actions CI/CD Workflows',
                prerequisites: ['dev_git_workflows'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'dev_gh_workflow_jobs', skillName: 'Actions Triggers, Jobs & Step Runners', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dev_ecr_docker_push', skillName: 'Automated Image Building & Registry Push', prerequisites: ['dev_gh_workflow_jobs'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dev_top_k8s_infra',
        name: 'Kubernetes Container Orchestration',
        subtopics: [
          {
            id: 'dev_sub_k8s',
            name: 'Pods, Services & Ingress',
            skills: [
              {
                skillId: 'dev_k8s_pods_services',
                skillName: 'Kubernetes Pods, Deployments & Services',
                prerequisites: ['dev_github_actions'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'dev_k8s_pod_lifecycle', skillName: 'Pod Specs, Replicas & Rolling Updates', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dev_cluster_ip_nodeport', skillName: 'ClusterIP, NodePort & LoadBalancer Services', prerequisites: ['dev_k8s_pod_lifecycle'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dev_k8s_ingress_helm',
                skillName: 'Kubernetes Ingress & Helm Chart Deployment',
                prerequisites: ['dev_k8s_pods_services'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'dev_nginx_ingress_rules', skillName: 'Nginx Ingress Controllers & SSL Certificates', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dev_helm_chart_templates', skillName: 'Helm Values & Chart Release Management', prerequisites: ['dev_nginx_ingress_rules'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dev_top_iac_terraform',
        name: 'Infrastructure as Code (IaC)',
        subtopics: [
          {
            id: 'dev_sub_terraform',
            name: 'Terraform & Cloud Provisioning',
            skills: [
              {
                skillId: 'dev_terraform_hcl',
                skillName: 'Terraform Syntax & HCL State Management',
                prerequisites: ['dev_k8s_ingress_helm'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'dev_tf_providers_resources', skillName: 'Terraform Resources, Variables & Outputs', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dev_s3_backend_locking', skillName: 'S3 Remote State & DynamoDB Locking', prerequisites: ['dev_tf_providers_resources'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dev_ansible_config',
                skillName: 'Ansible Playbooks & Configuration Management',
                prerequisites: ['dev_terraform_hcl'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'dev_ansible_inventory_roles', skillName: 'Ansible Inventory & Modular Roles', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dev_idempotent_playbooks', skillName: 'Writing Idempotent Provisioning Tasks', prerequisites: ['dev_ansible_inventory_roles'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dev_top_observability',
        name: 'Cloud Observability & Architecture Capstone',
        subtopics: [
          {
            id: 'dev_sub_obs',
            name: 'Prometheus & Grafana',
            skills: [
              {
                skillId: 'dev_prometheus_grafana',
                skillName: 'Prometheus Metrics & Grafana Dashboards',
                prerequisites: ['dev_ansible_config'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'dev_promql_queries', skillName: 'PromQL Queries & Node Exporters', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dev_alertmanager_rules', skillName: 'Alertmanager Rules & Grafana Visualizations', prerequisites: ['dev_promql_queries'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dev_cloud_sec_capstone',
                skillName: 'Cloud Architecture & Disaster Recovery Capstone',
                prerequisites: ['dev_prometheus_grafana'],
                difficulty: 'ADVANCED',
                estimatedHours: 10,
                subskills: [
                  { subskillId: 'dev_iam_zero_trust', skillName: 'AWS IAM Policies & Least Privilege Security', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dev_dr_multi_region', skillName: 'Multi-Region Failover & Disaster Recovery', prerequisites: ['dev_iam_zero_trust'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  dsa: {
    domainId: 'dsa',
    domainName: 'Data Structures & Algorithms (Interview Prep)',
    topics: [
      {
        id: 'dsa_top_programming_fundamentals',
        name: 'Programming Fundamentals',
        subtopics: [
          {
            id: 'dsa_sub_language_basics',
            name: 'Language Basics & Problem Solving',
            skills: [
              {
                skillId: 'dsa_programming_basics',
                skillName: 'Programming Basics',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'dsa_variables_types_io', subskillName: 'Variables, Data Types & Input/Output', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_operators_expressions', subskillName: 'Operators & Expressions', prerequisites: ['dsa_variables_types_io'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_control_flow',
                skillName: 'Conditionals, Loops & Basic Problems',
                prerequisites: ['dsa_programming_basics'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dsa_conditionals', subskillName: 'if/else, switch & Conditional Logic', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_loops', subskillName: 'for, while & do-while Loops', prerequisites: ['dsa_conditionals'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_pattern_problems', subskillName: 'Pattern Printing & Basic Problem Solving', prerequisites: ['dsa_loops'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_functions_arrays_strings',
                skillName: 'Functions, Arrays & Strings',
                prerequisites: ['dsa_control_flow'],
                difficulty: 'BEGINNER',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'dsa_functions', subskillName: 'Functions, Parameters & Return Values', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_arrays', subskillName: 'Arrays, Traversal & Basic Manipulation', prerequisites: ['dsa_functions'], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_strings', subskillName: 'Strings & Basic String Problems', prerequisites: ['dsa_arrays'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dsa_top_fund',
        name: 'Programming Logic & Complexity Analysis',
        subtopics: [
          {
            id: 'dsa_sub_logic',
            name: 'Big-O & Fundamentals',
            skills: [
              {
                skillId: 'dsa_big_o_analysis',
                skillName: 'Big-O Time & Space Complexity',
                prerequisites: ['dsa_functions_arrays_strings'],
                difficulty: 'BEGINNER',
                estimatedHours: 3,
                subskills: [
                  { subskillId: 'dsa_time_complexity', skillName: 'Big-O Time Complexity Analysis', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_space_complexity', skillName: 'Space Complexity & Auxiliary Memory', prerequisites: ['dsa_time_complexity'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_recursion_basics',
                skillName: 'Recursion Fundamentals & Call Stack',
                prerequisites: ['dsa_big_o_analysis'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'dsa_base_recursive_case', skillName: 'Base Cases & Recursive Decomposition', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_stack_overflow_depth', skillName: 'Recursion Call Stack Depth & Tail Call', prerequisites: ['dsa_base_recursive_case'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dsa_top_arr_hash',
        name: 'Arrays, Hash Maps & Two Pointers',
        subtopics: [
          {
            id: 'dsa_sub_arrays',
            name: 'Hashing & Pointers',
            skills: [
              {
                skillId: 'dsa_array_hashmaps',
                skillName: 'Array Mutation & Hash Map O(1) Lookups',
                prerequisites: ['dsa_recursion_basics'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'dsa_hash_tables_collisions', skillName: 'Hash Table Insertions & Collision Resolution', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_prefix_sum_array', skillName: 'Prefix Sum Array & Range Sum Queries', prerequisites: ['dsa_hash_tables_collisions'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_two_pointers',
                skillName: 'Two Pointers Technique & In-Place Mutation',
                prerequisites: ['dsa_array_hashmaps'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'dsa_sorted_two_sum', skillName: 'Sorted Array Two Sum & Pair Search', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_container_water', skillName: 'Container With Most Water & Partitioning', prerequisites: ['dsa_sorted_two_sum'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dsa_top_window_pointers',
        name: 'Sliding Window & Fast/Slow Pointers',
        subtopics: [
          {
            id: 'dsa_sub_window',
            name: 'Sliding Window & Cycle Search',
            skills: [
              {
                skillId: 'dsa_sliding_window',
                skillName: 'Sliding Window (Fixed & Dynamic)',
                prerequisites: ['dsa_two_pointers'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dsa_fixed_window_max', skillName: 'Fixed Window Max Sum Subarray', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'dsa_dynamic_window_shrink', skillName: 'Dynamic Window Shrink Strategy', prerequisites: ['dsa_fixed_window_max'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_floyd_pointers',
                skillName: 'Fast & Slow Pointers (Cycle Detection)',
                prerequisites: ['dsa_sliding_window'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dsa_floyd_tortoise_hare', skillName: 'Floyd Tortoise & Hare Cycle Algorithm', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dsa_linked_list_midpoint', skillName: 'Linked List Midpoint & Cycle Start', prerequisites: ['dsa_floyd_tortoise_hare'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dsa_top_stacks_queues',
        name: 'Stacks & Queues',
        subtopics: [
          {
            id: 'dsa_sub_stacks',
            name: 'LIFO/FIFO & Monotonic Stacks',
            skills: [
              {
                skillId: 'dsa_stacks_parentheses',
                skillName: 'Stack LIFO Operations & Valid Parentheses',
                prerequisites: ['dsa_floyd_pointers'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dsa_stack_matching', skillName: 'Bracket Matching & Expression Stacks', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dsa_postfix_evaluation', skillName: 'Postfix Notation Evaluation & Operands', prerequisites: ['dsa_stack_matching'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_monotonic_stacks',
                skillName: 'Monotonic Stack Pattern',
                prerequisites: ['dsa_stacks_parentheses'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'dsa_next_greater_elem', skillName: 'Next Greater Element Linear Scan', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dsa_histogram_water', skillName: 'Largest Rectangle in Histogram & Trapping Water', prerequisites: ['dsa_next_greater_elem'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dsa_top_trees_bst',
        name: 'Trees & Search Algorithms',
        subtopics: [
          {
            id: 'dsa_sub_trees',
            name: 'BST & Traversals',
            skills: [
              {
                skillId: 'dsa_bst_operations',
                skillName: 'Binary Search Tree Search & In-Order Traversal',
                prerequisites: ['dsa_monotonic_stacks'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'dsa_bst_search_insert', skillName: 'BST Search, Insertion & Deletion', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dsa_tree_traversals', skillName: 'Pre-Order, In-Order & Post-Order Recursion', prerequisites: ['dsa_bst_search_insert'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_heaps_priority',
                skillName: 'Min/Max Heap & Priority Queue',
                prerequisites: ['dsa_bst_operations'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'dsa_heapify_percolate', skillName: 'Binary Heap Structure & Heapify Operations', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'dsa_top_k_frequent', skillName: 'Top K Frequent Elements & Priority Queues', prerequisites: ['dsa_heapify_percolate'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dsa_top_graphs_shortest',
        name: 'Graph Algorithms & Shortest Path',
        subtopics: [
          {
            id: 'dsa_sub_graphs',
            name: 'BFS/DFS & Dijkstra',
            skills: [
              {
                skillId: 'dsa_bfs_dfs_traversal',
                skillName: 'Breadth-First & Depth-First Graph Search',
                prerequisites: ['dsa_heaps_priority'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'dsa_graph_adj_list', skillName: 'Adjacency List Representation & BFS Queues', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dsa_connected_components', skillName: 'DFS Island Counting & Cycle Detection', prerequisites: ['dsa_graph_adj_list'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_dijkstra_shortest',
                skillName: 'Dijkstra Shortest Path & Topological Sort',
                prerequisites: ['dsa_bfs_dfs_traversal'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'dsa_kahn_topological', skillName: 'Kahn DAG Topological Sorting', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dsa_dijkstra_min_heap', skillName: 'Dijkstra Weighted Shortest Path via Min-Heap', prerequisites: ['dsa_kahn_topological'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dsa_top_dp_patterns',
        name: 'Dynamic Programming Patterns',
        subtopics: [
          {
            id: 'dsa_sub_dp',
            name: 'Memoization & 0/1 Knapsack',
            skills: [
              {
                skillId: 'dsa_dp_memo_tabulation',
                skillName: 'Dynamic Programming Memoization vs Tabulation',
                prerequisites: ['dsa_dijkstra_shortest'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'dsa_climbing_stairs', skillName: '1D State Space: Climbing Stairs & House Robber', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dsa_memo_cache_tree', skillName: 'Top-Down Recursion Tree Caching', prerequisites: ['dsa_climbing_stairs'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'dsa_dp_knapsack_lcs',
                skillName: '0/1 Knapsack & Longest Common Subsequence',
                prerequisites: ['dsa_dp_memo_tabulation'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'dsa_knapsack_2d_table', skillName: '2D DP Matrix: 0/1 Knapsack Inclusion', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'dsa_lcs_edit_distance', skillName: 'Longest Common Subsequence & Edit Distance', prerequisites: ['dsa_knapsack_2d_table'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  mobile: {
    domainId: 'mobile',
    domainName: 'Mobile App Development (React Native & Flutter)',
    topics: [
      {
        id: 'mob_top_lang_found',
        name: 'Mobile Programming & Language Syntax',
        subtopics: [
          {
            id: 'mob_sub_lang',
            name: 'JS & Dart Syntax',
            skills: [
              {
                skillId: 'mob_lang_syntax',
                skillName: 'JavaScript/Dart Mobile Syntax',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'mob_syntax_vars', skillName: 'Mobile Language Syntax & Primitives', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'mob_dart_classes', skillName: 'Dart Classes & ES6 Object Classes', prerequisites: ['mob_syntax_vars'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mob_async_dart_js',
                skillName: 'Asynchronous Programming in Mobile Apps',
                prerequisites: ['mob_lang_syntax'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'mob_futures_promises', skillName: 'Futures & Promises Asynchronous Execution', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'mob_async_await_ops', skillName: 'Async/Await Data Loading Patterns', prerequisites: ['mob_futures_promises'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mob_top_ui_flex',
        name: 'Mobile UI Layouts & Components',
        subtopics: [
          {
            id: 'mob_sub_ui',
            name: 'Flexbox & Custom Widgets',
            skills: [
              {
                skillId: 'mob_flexbox_ui',
                skillName: 'Mobile Screen Layouts & Flexbox Engine',
                prerequisites: ['mob_async_dart_js'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'mob_flex_direction_align', skillName: 'Flex Direction, Alignment & Responsive Units', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'mob_screen_adaptation', skillName: 'Screen Aspect Ratio & Multi-Device Sizing', prerequisites: ['mob_flex_direction_align'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mob_widgets_components',
                skillName: 'Reusable Custom Mobile UI Components',
                prerequisites: ['mob_flexbox_ui'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'mob_stateless_stateful', skillName: 'Stateless vs Stateful Component Lifecycle', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'mob_touch_events', skillName: 'Gesture Detection, Taps & Touch Response', prerequisites: ['mob_stateless_stateful'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mob_top_state_nav',
        name: 'State Management & Navigation Architecture',
        subtopics: [
          {
            id: 'mob_sub_state',
            name: 'Redux / Provider & Router',
            skills: [
              {
                skillId: 'mob_state_management',
                skillName: 'Redux / Provider / Context State Management',
                prerequisites: ['mob_widgets_components'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'mob_store_actions_reducers', skillName: 'State Store, Action Dispatchers & Reducers', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'mob_global_app_state', skillName: 'Global App State Sync & UI Binding', prerequisites: ['mob_store_actions_reducers'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mob_navigation_routing',
                skillName: 'Stack, Tab & Deep Link Navigation',
                prerequisites: ['mob_state_management'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'mob_stack_tab_routers', skillName: 'React Navigation / GoRouter Stack Management', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'mob_deep_link_params', skillName: 'URL Deep Linking & Parameter Passing', prerequisites: ['mob_stack_tab_routers'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mob_top_native_hardware',
        name: 'Native Hardware Integration & Push Notifications',
        subtopics: [
          {
            id: 'mob_sub_hardware',
            name: 'Camera, Location & FCM',
            skills: [
              {
                skillId: 'mob_camera_location_api',
                skillName: 'Camera & Geolocation Device APIs',
                prerequisites: ['mob_navigation_routing'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'mob_camera_photo_picker', skillName: 'Camera Capture & Photo Gallery Picker', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'mob_gps_location_tracking', skillName: 'GPS Geolocation & Map Marker Rendering', prerequisites: ['mob_camera_photo_picker'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mob_push_notifications',
                skillName: 'Firebase Cloud Messaging (FCM) & Push Alerts',
                prerequisites: ['mob_camera_location_api'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'mob_fcm_token_registration', skillName: 'FCM Token Registration & Payload Handler', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'mob_foreground_background_alerts', skillName: 'Foreground & Background Alert Scheduling', prerequisites: ['mob_fcm_token_registration'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mob_top_perf_storage',
        name: 'Mobile Performance & Local Storage',
        subtopics: [
          {
            id: 'mob_sub_storage',
            name: 'AsyncStorage & Profiling',
            skills: [
              {
                skillId: 'mob_local_db_storage',
                skillName: 'AsyncStorage & SQLite Local Databases',
                prerequisites: ['mob_push_notifications'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'mob_kv_asyncstorage', skillName: 'Key-Value AsyncStorage Persistence', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'mob_sqlite_relational_queries', skillName: 'SQLite Schema & Offline Database CRUD', prerequisites: ['mob_kv_asyncstorage'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mob_perf_profiling',
                skillName: 'FPS Optimization & Memory Leak Profiling',
                prerequisites: ['mob_local_db_storage'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'mob_flatlist_virtualization', skillName: 'FlatList & ListView Window Virtualization', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'mob_flipper_performance_profiling', skillName: 'Flipper & DevTools Memory Heap Profiling', prerequisites: ['mob_flatlist_virtualization'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mob_top_security_auth',
        name: 'App Security & Authentication',
        subtopics: [
          {
            id: 'mob_sub_security',
            name: 'Keychain & Biometrics',
            skills: [
              {
                skillId: 'mob_oauth_keychain',
                skillName: 'OAuth 2.0 & Secure Keychain Storage',
                prerequisites: ['mob_perf_profiling'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'mob_oauth_jwt_flow', skillName: 'OAuth 2.0 PKCE Flow & Token Storage', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'mob_ios_keychain_android_keystore', skillName: 'iOS Keychain & Android Keystore Encryption', prerequisites: ['mob_oauth_jwt_flow'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mob_biometric_auth',
                skillName: 'Biometric Auth & SSL Pinning Security',
                prerequisites: ['mob_oauth_keychain'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'mob_touch_face_id_api', skillName: 'Face ID & Touch ID Local Authentication', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'mob_ssl_certificate_pinning', skillName: 'SSL Certificate Pinning & Obfuscation', prerequisites: ['mob_touch_face_id_api'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mob_top_store_publishing',
        name: 'App Store Publishing & CI/CD Capstone',
        subtopics: [
          {
            id: 'mob_sub_publishing',
            name: 'Fastlane & Release Build',
            skills: [
              {
                skillId: 'mob_fastlane_signing',
                skillName: 'Fastlane Automation & Code Signing',
                prerequisites: ['mob_biometric_auth'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'mob_ios_provisioning_profiles', skillName: 'iOS Provisioning Profiles & Certificates', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'mob_android_keystore_aab', skillName: 'Android Release Key & AAB Bundles', prerequisites: ['mob_ios_provisioning_profiles'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'mob_store_submission_capstone',
                skillName: 'App Store & Play Store Submission Capstone',
                prerequisites: ['mob_fastlane_signing'],
                difficulty: 'ADVANCED',
                estimatedHours: 10,
                subskills: [
                  { subskillId: 'mob_app_store_connect_upload', skillName: 'App Store Connect Metadata & TestFlight', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'mob_google_play_console_release', skillName: 'Google Play Track Release & Capstone Launch', prerequisites: ['mob_app_store_connect_upload'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  ai_llm: {
    domainId: 'ai_llm',
    domainName: 'AI & LLM Systems Engineering',
    topics: [
      {
        id: 'ai_top_math_python',
        name: 'Python Programming & Math Foundations',
        subtopics: [
          {
            id: 'ai_sub_math',
            name: 'Linear Algebra & APIs',
            skills: [
              {
                skillId: 'ai_math_vectors',
                skillName: 'Linear Algebra, Matrices & Vector Math',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'ai_dot_product_matrices', skillName: 'Dot Products & Matrix Multiplication', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'ai_vector_spaces_norm', skillName: 'Vector Spaces & Euclidean/L2 Norms', prerequisites: ['ai_dot_product_matrices'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ai_python_apis',
                skillName: 'Python LLM SDKs & API Requests',
                prerequisites: ['ai_math_vectors'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'ai_groq_openai_client', skillName: 'Groq & OpenAI Python Client Calls', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'ai_token_counting_pricing', skillName: 'Token Estimation & API Cost Control', prerequisites: ['ai_groq_openai_client'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ai_top_prompts_design',
        name: 'Prompt Engineering & Structured Context',
        subtopics: [
          {
            id: 'ai_sub_prompts',
            name: 'System Role & JSON Schemas',
            skills: [
              {
                skillId: 'ai_prompt_design',
                skillName: 'System Prompts & Context Window Allocation',
                prerequisites: ['ai_python_apis'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'ai_zero_few_shot_prompt', skillName: 'Zero-Shot & Few-Shot In-Context Prompting', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'ai_system_role_constraints', skillName: 'System Role Persona & Guardrail Rules', prerequisites: ['ai_zero_few_shot_prompt'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ai_structured_json',
                skillName: 'Structured JSON Schemas & Output Parsing',
                prerequisites: ['ai_prompt_design'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'ai_pydantic_schema_bind', skillName: 'Pydantic Model Schema Validation', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'ai_json_repair_retry', skillName: 'JSON Output Repair & Structural Retry Loop', prerequisites: ['ai_pydantic_schema_bind'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ai_top_embeddings_vec',
        name: 'Embeddings & Vector Databases',
        subtopics: [
          {
            id: 'ai_sub_vector',
            name: 'Pinecone / Chroma & HNSW',
            skills: [
              {
                skillId: 'ai_vector_embeddings',
                skillName: 'Text Vector Embeddings & Similarity Metrics',
                prerequisites: ['ai_structured_json'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'ai_cosine_similarity_math', skillName: 'Cosine Similarity & Dot Product Search', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'ai_bge_ada_embeddings', skillName: 'OpenAI Ada & BGE Embedding Models', prerequisites: ['ai_cosine_similarity_math'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ai_vector_dbs_pinecone',
                skillName: 'Pinecone, ChromaDB & HNSW Vector Indexing',
                prerequisites: ['ai_vector_embeddings'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'ai_pinecone_index_upsert', skillName: 'Pinecone Index Creation & Vector Upserts', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'ai_hnsw_approx_neighbors', skillName: 'HNSW Graph Search & Distance Invariants', prerequisites: ['ai_pinecone_index_upsert'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ai_top_rag_architecture',
        name: 'RAG Architectures & Advanced Retrieval',
        subtopics: [
          {
            id: 'ai_sub_rag',
            name: 'Chunking & Hybrid Search',
            skills: [
              {
                skillId: 'ai_rag_chunking',
                skillName: 'Document Chunking Strategies & Ingestion',
                prerequisites: ['ai_vector_dbs_pinecone'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'ai_semantic_chunking_overlap', skillName: 'Recursive & Semantic Chunking with Overlap', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'ai_pdf_markdown_parsers', skillName: 'PDF & Unstructured Document Parsing', prerequisites: ['ai_semantic_chunking_overlap'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ai_hybrid_search_rerank',
                skillName: 'Hybrid Search & Cross-Encoder Re-Ranking',
                prerequisites: ['ai_rag_chunking'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'ai_bm25_vector_fusion', skillName: 'BM25 Keyword & Vector Reciprocal Rank Fusion', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ai_cohere_rerank_scoring', skillName: 'Cohere Cross-Encoder Scoring & Selection', prerequisites: ['ai_bm25_vector_fusion'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ai_top_fine_tuning',
        name: 'LLM Fine-Tuning & Quantization',
        subtopics: [
          {
            id: 'ai_sub_fine_tuning',
            name: 'LoRA / QLoRA & Ollama',
            skills: [
              {
                skillId: 'ai_lora_fine_tuning',
                skillName: 'LoRA & QLoRA Parameter Efficient Tuning',
                prerequisites: ['ai_hybrid_search_rerank'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'ai_instruction_dataset_jsonl', skillName: 'Instruction Tuning Dataset Formatting', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ai_peft_unsloth_training', skillName: 'PEFT & Unsloth Model Weight Adapter Training', prerequisites: ['ai_instruction_dataset_jsonl'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ai_quantization_serving',
                skillName: 'Model Quantization (GGUF) & Local Ollama',
                prerequisites: ['ai_lora_fine_tuning'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'ai_gguf_bitsandbytes', skillName: 'GGUF 4-bit Quantization Mechanics', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ai_ollama_local_serving', skillName: 'Ollama Local Serving & Endpoint Exposure', prerequisites: ['ai_gguf_bitsandbytes'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ai_top_agent_frameworks',
        name: 'Autonomous AI Agents & Tool Calling',
        subtopics: [
          {
            id: 'ai_sub_agents',
            name: 'ReAct Loops & Tool Schemas',
            skills: [
              {
                skillId: 'ai_react_agent_loop',
                skillName: 'ReAct Agent Execution Loop Architecture',
                prerequisites: ['ai_quantization_serving'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'ai_thought_action_observation', skillName: 'Thought-Action-Observation Step Trajectory', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ai_agent_state_persistence', skillName: 'Agent Memory & Conversation History State', prerequisites: ['ai_thought_action_observation'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ai_tool_calling_schema',
                skillName: 'Function Calling & Schema Tool Binding',
                prerequisites: ['ai_react_agent_loop'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'ai_tool_definition_json', skillName: 'JSON Schema Tool Declarations & Parameters', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ai_multiagent_collaboration', skillName: 'Multi-Agent Orchestration & Supervisor Delegation', prerequisites: ['ai_tool_definition_json'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ai_top_guardrails_eval',
        name: 'Evaluation, Safety & Guardrails Capstone',
        subtopics: [
          {
            id: 'ai_sub_eval',
            name: 'Hallucinations & Guardrails',
            skills: [
              {
                skillId: 'ai_guardrails_nemo',
                skillName: 'NeMo Guardrails & Hallucination Prevention',
                prerequisites: ['ai_tool_calling_schema'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'ai_prompt_injection_shield', skillName: 'Prompt Injection Defense & Input Filtering', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ai_ragas_evaluation_metrics', skillName: 'RAGAS Faithfulness & Context Recall Metrics', prerequisites: ['ai_prompt_injection_shield'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'ai_llm_eval_capstone',
                skillName: 'End-to-End LLM Agent Systems Capstone',
                prerequisites: ['ai_guardrails_nemo'],
                difficulty: 'ADVANCED',
                estimatedHours: 10,
                subskills: [
                  { subskillId: 'ai_latency_cost_optimization', skillName: 'Streaming & Latency Optimization', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'ai_prod_agent_deploy_capstone', skillName: 'Production Autonomous AI System Launch', prerequisites: ['ai_latency_cost_optimization'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  system_design: {
    domainId: 'system_design',
    domainName: 'System Design & Distributed Architecture',
    topics: [
      {
        id: 'sd_top_server_fund',
        name: 'Server Basics & Networking Fundamentals',
        subtopics: [
          {
            id: 'sd_sub_fund',
            name: 'Client-Server & Protocols',
            skills: [
              {
                skillId: 'sd_http_client_server',
                skillName: 'Client-Server Principles & HTTP/HTTPS',
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'sd_client_req', skillName: 'HTTP Request/Response Anatomy', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'sd_dns_routing', skillName: 'DNS Resolution & Routing', prerequisites: ['sd_client_req'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sd_web_servers_sockets',
                skillName: 'Web Servers & WebSockets Architecture',
                prerequisites: ['sd_http_client_server'],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: 'sd_socket_duplex', skillName: 'Full-Duplex TCP WebSockets', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'sd_keep_alive_headers', skillName: 'HTTP Keep-Alive & Connection Pooling', prerequisites: ['sd_socket_duplex'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sd_top_scaling_lb',
        name: 'Scalability & Load Balancing',
        subtopics: [
          {
            id: 'sd_sub_scale',
            name: 'Horizontal Scale & Hashing',
            skills: [
              {
                skillId: 'sd_load_balancers',
                skillName: 'Layer 4 vs Layer 7 Load Balancing',
                prerequisites: ['sd_web_servers_sockets'],
                difficulty: 'BEGINNER',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'sd_rr_least_conn', skillName: 'Round Robin & Least Connections Algorithms', prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: 'sd_health_checks_failover', skillName: 'Health Check Probes & Node Failover', prerequisites: ['sd_rr_least_conn'], difficulty: 'BEGINNER', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sd_consistent_hashing',
                skillName: 'Consistent Hashing & Stateless App Nodes',
                prerequisites: ['sd_load_balancers'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'sd_hash_ring_virtual_nodes', skillName: 'Hash Ring & Virtual Node Partitioning', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sd_token_bucket_ratelimit', skillName: 'Token Bucket & Leaky Bucket Rate Limiting', prerequisites: ['sd_hash_ring_virtual_nodes'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sd_top_caching_cdn',
        name: 'Caching & Content Delivery',
        subtopics: [
          {
            id: 'sd_sub_cache',
            name: 'Redis & CDN Edge Caching',
            skills: [
              {
                skillId: 'sd_redis_cache_aside',
                skillName: 'Redis In-Memory Store & Cache Patterns',
                prerequisites: ['sd_consistent_hashing'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sd_cache_aside_write_through', skillName: 'Cache-Aside & Write-Through Invalidation', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sd_lru_lfu_eviction', skillName: 'LRU & LFU Cache Eviction Policies', prerequisites: ['sd_cache_aside_write_through'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sd_cdn_invalidation',
                skillName: 'Content Delivery Networks (CDNs)',
                prerequisites: ['sd_redis_cache_aside'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 5,
                subskills: [
                  { subskillId: 'sd_edge_servers_origin', skillName: 'Edge Server Distribution & Origin Shield', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sd_cache_stampede_prevention', skillName: 'Cache Stampede Prevention & Mutex Locks', prerequisites: ['sd_edge_servers_origin'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sd_top_db_sharding',
        name: 'Database Sharding & Replication',
        subtopics: [
          {
            id: 'sd_sub_db',
            name: 'Replicas & Sharding Keys',
            skills: [
              {
                skillId: 'sd_read_replicas',
                skillName: 'Master-Slave Read Replicas & Replication Lag',
                prerequisites: ['sd_cdn_invalidation'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sd_sync_async_replication', skillName: 'Synchronous vs Asynchronous Replication', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sd_read_write_splitting', skillName: 'Read/Write Splitting Proxy Connection Pool', prerequisites: ['sd_sync_async_replication'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sd_sharding_cap_theorem',
                skillName: 'Database Horizontal Sharding & CAP Theorem',
                prerequisites: ['sd_read_replicas'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'sd_sharding_keys_hotspots', skillName: 'Sharding Key Selection & Hotspot Mitigation', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sd_cap_theorem_tradeoffs', skillName: 'Consistency vs Availability (CAP Theorem)', prerequisites: ['sd_sharding_keys_hotspots'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sd_top_queues_streaming',
        name: 'Asynchronous Queues & Event Streaming',
        subtopics: [
          {
            id: 'sd_sub_queues',
            name: 'RabbitMQ & Kafka',
            skills: [
              {
                skillId: 'sd_rabbitmq_queues',
                skillName: 'Message Queues (RabbitMQ & Task Deferral)',
                prerequisites: ['sd_sharding_cap_theorem'],
                difficulty: 'INTERMEDIATE',
                estimatedHours: 6,
                subskills: [
                  { subskillId: 'sd_pub_sub_exchanges', skillName: 'Exchange Binding & Pub/Sub Routing', prerequisites: [], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 },
                  { subskillId: 'sd_dead_letter_queues', skillName: 'Dead Letter Queues & Retry Backoff Policy', prerequisites: ['sd_pub_sub_exchanges'], difficulty: 'INTERMEDIATE', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sd_kafka_streaming',
                skillName: 'Event Streaming (Apache Kafka Partitioning)',
                prerequisites: ['sd_rabbitmq_queues'],
                difficulty: 'ADVANCED',
                estimatedHours: 7,
                subskills: [
                  { subskillId: 'sd_kafka_topics_partitions', skillName: 'Kafka Log Append Topics & Partition Offset', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sd_consumer_groups_idempotency', skillName: 'Consumer Groups & Idempotent Event Processing', prerequisites: ['sd_kafka_topics_partitions'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sd_top_dist_consensus',
        name: 'Distributed Systems & Consistency Patterns',
        subtopics: [
          {
            id: 'sd_sub_dist',
            name: 'Raft & Distributed Locks',
            skills: [
              {
                skillId: 'sd_consensus_raft',
                skillName: 'Consensus Algorithms (Raft Protocol)',
                prerequisites: ['sd_kafka_streaming'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'sd_leader_election_heartbeat', skillName: 'Leader Election & Heartbeat Timers', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sd_log_replication_quorum', skillName: 'Log Replication & Quorum Voting Majority', prerequisites: ['sd_leader_election_heartbeat'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sd_distributed_locks',
                skillName: 'Distributed Locking & Saga Transactions',
                prerequisites: ['sd_consensus_raft'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'sd_redlock_algorithm', skillName: 'Redlock Mutex Algorithm via Redis', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sd_saga_pattern_compensating', skillName: 'Saga Pattern & Compensating Transactions', prerequisites: ['sd_redlock_algorithm'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sd_top_microservices',
        name: 'Microservices & High Availability Capstone',
        subtopics: [
          {
            id: 'sd_sub_micro',
            name: 'Istio, gRPC & API Gateway',
            skills: [
              {
                skillId: 'sd_service_mesh',
                skillName: 'Service Mesh (Istio) & Circuit Breakers',
                prerequisites: ['sd_distributed_locks'],
                difficulty: 'ADVANCED',
                estimatedHours: 8,
                subskills: [
                  { subskillId: 'sd_envoy_sidecar_proxy', skillName: 'Envoy Sidecar Proxies & Mutual TLS (mTLS)', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sd_circuit_breaker_resilience', skillName: 'Circuit Breaker Pattern & Fallback Logic', prerequisites: ['sd_envoy_sidecar_proxy'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
                ]
              },
              {
                skillId: 'sd_api_gateway_capstone',
                skillName: 'API Gateway Routing & System Design Capstone',
                prerequisites: ['sd_service_mesh'],
                difficulty: 'ADVANCED',
                estimatedHours: 10,
                subskills: [
                  { subskillId: 'sd_grpc_protobuf_streams', skillName: 'gRPC Protobuf Binary Serialization & Streams', prerequisites: [], difficulty: 'ADVANCED', estimatedMinutes: 45 },
                  { subskillId: 'sd_distributed_tracing_jaeger', skillName: 'Distributed Tracing (Jaeger) & Capstone Architecture', prerequisites: ['sd_grpc_protobuf_streams'], difficulty: 'ADVANCED', estimatedMinutes: 45 }
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
  devops: { id: 'devops', displayName: 'Cloud Engineering / DevOps' },
  cybersecurity: { id: 'cybersecurity', displayName: 'Cybersecurity' },
  mobile: { id: 'mobile', displayName: 'Mobile Development' },
  dsa: { id: 'dsa', displayName: 'Data Structures & Algorithms' },
  ai_llm: { id: 'ai_llm', displayName: 'AI & LLM Engineering' },
  system_design: { id: 'system_design', displayName: 'System Design & Architecture' }
};

/**
 * Normalizes domain key
 */
function normalizeDomainKey(rawDomain) {
  if (!rawDomain || typeof rawDomain !== 'string') return 'fullstack';
  const clean = rawDomain.trim().toLowerCase();
  if (clean.includes('datascience') || clean.includes('data science') || clean.includes('machine learning')) return 'datascience';
  if (clean.includes('dsa') || clean.includes('algorithm') || clean.includes('data structure') || clean.includes('interview prep')) return 'dsa';
  if (clean.includes('devops') || clean.includes('cloud')) return 'devops';
  if (clean.includes('cyber') || clean.includes('security') || clean.includes('hacking')) return 'cybersecurity';
  if (clean.includes('mobile') || clean.includes('react native') || clean.includes('flutter') || clean.includes('ios') || clean.includes('android')) return 'mobile';
  if (clean.includes('ai') || clean.includes('llm') || clean.includes('genai') || clean.includes('rag')) return 'ai_llm';
  if (clean.includes('system design') || clean.includes('system_design') || clean.includes('architecture') || clean.includes('microservice')) return 'system_design';
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
