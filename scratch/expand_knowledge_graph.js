const fs = require('fs');
const path = require('path');

// Helper to create subskills
function makeSubskills(skillId, skillName, diff) {
  return [
    { subskillId: `${skillId}_sub1`, subskillName: `${skillName}: Core Principles & Syntax`, prerequisites: [], difficulty: diff, estimatedMinutes: 45 },
    { subskillId: `${skillId}_sub2`, subskillName: `${skillName}: Component Structure & Memory`, prerequisites: [`${skillId}_sub1`], difficulty: diff, estimatedMinutes: 45 },
    { subskillId: `${skillId}_sub3`, subskillName: `${skillName}: Implementation Patterns & Flow`, prerequisites: [`${skillId}_sub2`], difficulty: diff, estimatedMinutes: 45 },
    { subskillId: `${skillId}_sub4`, subskillName: `${skillName}: Edge Cases & Practical Exercises`, prerequisites: [`${skillId}_sub3`], difficulty: diff, estimatedMinutes: 45 },
    { subskillId: `${skillId}_sub5`, subskillName: `${skillName}: Integration & Placement Questions`, prerequisites: [`${skillId}_sub4`], difficulty: diff, estimatedMinutes: 45 },
    { subskillId: `${skillId}_sub6`, subskillName: `${skillName}: Hands-on Project & Evaluation`, prerequisites: [`${skillId}_sub5`], difficulty: diff, estimatedMinutes: 45 }
  ];
}

// 8 domains data definition
const domainsData = {
  fullstack: {
    domainId: 'fullstack',
    domainName: 'Full-Stack Web Development',
    skills: {
      BEGINNER: [
        { id: 'web_html_elem', name: 'HTML5 Semantic Elements', prereqs: [] },
        { id: 'web_css_box', name: 'CSS Box Model & Flexbox', prereqs: ['web_html_elem'] },
        { id: 'web_css_grid', name: 'CSS Grid & Responsive Layouts', prereqs: ['web_css_box'] },
        { id: 'js_vars_types', name: 'JS Variables, Types & Operators', prereqs: ['web_css_box'] },
        { id: 'js_control_flow', name: 'Control Flow, Loops & Conditionals', prereqs: ['js_vars_types'] },
        { id: 'js_funcs_scope', name: 'JS Functions, Scope & Closures', prereqs: ['js_control_flow'] },
        { id: 'js_arrays_objs', name: 'JS Arrays, Objects & ES6+ Features', prereqs: ['js_funcs_scope'] },
        { id: 'web_git_basics', name: 'Git Version Control & Repository Setup', prereqs: ['web_html_elem'] },
        { id: 'web_html_forms_a11y', name: 'HTML5 Form Validation & ARIA Accessibility', prereqs: ['web_html_elem'] },
        { id: 'web_css_animations', name: 'CSS Transitions, Transforms & Keyframes', prereqs: ['web_css_grid'] },
        { id: 'web_npm_tooling', name: 'Node Package Manager (NPM) & Modern Bundlers', prereqs: ['js_vars_types'] },
        { id: 'web_browser_storage', name: 'Client-Side Storage: LocalStorage & SessionStorage', prereqs: ['js_arrays_objs'] }
      ],
      INTERMEDIATE: [
        { id: 'js_dom_events', name: 'DOM Selection & Event Handling', prereqs: ['js_arrays_objs'] },
        { id: 'js_promises_async', name: 'Promises & Async/Await', prereqs: ['js_dom_events'] },
        { id: 'js_fetch_api', name: 'Fetch API & AJAX Integration', prereqs: ['js_promises_async'] },
        { id: 'react_jsx_comps', name: 'React JSX & Component Hierarchy', prereqs: ['js_fetch_api'] },
        { id: 'react_props_state', name: 'React State & Props Management', prereqs: ['react_jsx_comps'] },
        { id: 'react_hooks_core', name: 'React Hooks (useState & useEffect)', prereqs: ['react_props_state'] },
        { id: 'react_router_arch', name: 'React Router & SPA Architecture', prereqs: ['react_hooks_core'] },
        { id: 'node_event_loop', name: 'Node.js Basics & Event Loop', prereqs: ['js_promises_async'] },
        { id: 'express_rest_apis', name: 'Express Middleware & REST APIs', prereqs: ['node_event_loop'] },
        { id: 'db_sql_relational', name: 'SQL Database Design & Queries', prereqs: ['express_rest_apis'] },
        { id: 'db_mongo_nosql', name: 'MongoDB Document Schemas & Mongoose', prereqs: ['express_rest_apis'] },
        { id: 'web_auth_jwt_sessions', name: 'JWT Authentication & Session Management', prereqs: ['express_rest_apis', 'db_mongo_nosql'] }
      ],
      ADVANCED: [
        { id: 'web_auth_jwt', name: 'Authentication & JWT Session Security', prereqs: ['express_rest_apis', 'db_mongo_nosql'] },
        { id: 'web_owasp_sec', name: 'XSS, CSRF, SQLi & CORS Security', prereqs: ['web_auth_jwt'] },
        { id: 'docker_containers', name: 'Docker Containerization for Web Apps', prereqs: ['express_rest_apis'] },
        { id: 'fullstack_deployment', name: 'CI/CD Pipelines & Cloud Deployment', prereqs: ['docker_containers'] },
        { id: 'web_ssr_nextjs', name: 'Next.js Server-Side Rendering & App Router', prereqs: ['react_router_arch'] },
        { id: 'web_websockets_realtime', name: 'Real-Time Communication with WebSockets & Socket.io', prereqs: ['express_rest_apis'] },
        { id: 'web_redis_caching', name: 'Redis In-Memory Caching & Session Stores', prereqs: ['express_rest_apis', 'db_sql_relational'] },
        { id: 'web_microservices_events', name: 'Microservices Architecture & Event-Driven Brokers', prereqs: ['docker_containers', 'express_rest_apis'] },
        { id: 'web_graphql_apis', name: 'GraphQL Schemas, Queries & Apollo Integration', prereqs: ['express_rest_apis'] },
        { id: 'web_ci_cd_pipelines', name: 'Automated GitHub Actions CI/CD Pipeline Workflows', prereqs: ['docker_containers'] },
        { id: 'web_observability_logging', name: 'Production Observability, APM & OpenTelemetry', prereqs: ['fullstack_deployment'] },
        { id: 'web_scale_load_balancing', name: 'High-Throughput Load Balancing & Horizontal Scaling', prereqs: ['fullstack_deployment'] }
      ]
    }
  },

  datascience: {
    domainId: 'datascience',
    domainName: 'Data Science & Machine Learning',
    skills: {
      BEGINNER: [
        { id: 'py_vars_primitives', name: 'Python Syntax & Primitive Data Types', prereqs: [] },
        { id: 'py_control_loops', name: 'Control Flow (if/else, loops)', prereqs: ['py_vars_primitives'] },
        { id: 'py_funcs_modules', name: 'Python Functions & Scope', prereqs: ['py_control_loops'] },
        { id: 'py_structs_lists', name: 'Python Data Structures (Lists, Dicts, Sets)', prereqs: ['py_funcs_modules'] },
        { id: 'np_vectorized_ops', name: 'NumPy Arrays & Linear Math', prereqs: ['py_structs_lists'] },
        { id: 'ds_py_file_io', name: 'Python File I/O, CSV & JSON Handling', prereqs: ['py_structs_lists'] },
        { id: 'ds_numpy_linear_algebra', name: 'NumPy Matrix Operations & Linear Algebra', prereqs: ['np_vectorized_ops'] },
        { id: 'ds_math_probability', name: 'Probability Foundations & Distributions', prereqs: ['py_funcs_modules'] },
        { id: 'ds_math_calculus', name: 'Calculus, Derivatives & Gradient Optimization', prereqs: ['np_vectorized_ops'] },
        { id: 'ds_sql_extraction', name: 'SQL Queries, Joins & Relational Extraction', prereqs: ['py_structs_lists'] },
        { id: 'ds_eda_matplotlib', name: 'Data Visualization with Matplotlib', prereqs: ['np_vectorized_ops'] },
        { id: 'ds_eda_seaborn', name: 'Statistical Visualizations & Heatmaps with Seaborn', prereqs: ['ds_eda_matplotlib'] }
      ],
      INTERMEDIATE: [
        { id: 'pd_df_manipulation', name: 'Pandas DataFrames & Manipulation', prereqs: ['np_vectorized_ops'] },
        { id: 'pd_cleaning_eda', name: 'Data Cleaning, Filtering & EDA', prereqs: ['pd_df_manipulation'] },
        { id: 'stat_desc_inf', name: 'Descriptive & Inferential Statistics', prereqs: ['pd_cleaning_eda'] },
        { id: 'stat_hyp_testing', name: 'Hypothesis Testing & p-values', prereqs: ['stat_desc_inf'] },
        { id: 'ml_lin_log_reg', name: 'Linear & Logistic Regression', prereqs: ['stat_hyp_testing'] },
        { id: 'ml_trees_forests', name: 'Decision Trees & Random Forests', prereqs: ['ml_lin_log_reg'] },
        { id: 'ds_feature_engineering', name: 'Feature Engineering, Scaling & Categorical Encoders', prereqs: ['pd_cleaning_eda'] },
        { id: 'ds_cross_validation', name: 'Cross-Validation, ROC-AUC & Model Selection', prereqs: ['ml_lin_log_reg'] },
        { id: 'ds_clustering_kmeans', name: 'K-Means & Hierarchical Unsupervised Clustering', prereqs: ['ml_trees_forests'] },
        { id: 'ds_pca_reduction', name: 'Principal Component Analysis & Dimensionality Reduction', prereqs: ['ds_clustering_kmeans'] },
        { id: 'ds_time_series_arima', name: 'Time Series Analysis, Seasonality & ARIMA Modeling', prereqs: ['ml_lin_log_reg'] },
        { id: 'ds_nlp_text_preprocessing', name: 'NLP Preprocessing, TF-IDF & Word Embeddings', prereqs: ['pd_cleaning_eda'] }
      ],
      ADVANCED: [
        { id: 'ml_grad_boosting', name: 'Gradient Boosting (XGBoost/LightGBM)', prereqs: ['ml_trees_forests'] },
        { id: 'ml_hyper_tuning', name: 'Hyperparameter Tuning & Cross-Validation', prereqs: ['ml_grad_boosting'] },
        { id: 'dl_ann_backprop', name: 'Neural Networks & Backpropagation', prereqs: ['ml_hyper_tuning'] },
        { id: 'dl_cnn_vision', name: 'CNNs for Computer Vision', prereqs: ['dl_ann_backprop'] },
        { id: 'nlp_transformers_llm', name: 'Transformers & LLM Fine-Tuning', prereqs: ['dl_ann_backprop'] },
        { id: 'mlops_fastapi_deploy', name: 'MLOps, Model Serving & FastAPI Deployment', prereqs: ['nlp_transformers_llm'] },
        { id: 'ds_pytorch_deep_learning', name: 'PyTorch Deep Learning & Custom Training Loops', prereqs: ['dl_ann_backprop'] },
        { id: 'ds_transformers_bert_huggingface', name: 'Hugging Face Transformers & BERT Architectures', prereqs: ['nlp_transformers_llm'] },
        { id: 'ds_mlflow_tracking', name: 'MLflow Experiment Tracking & Registry Governance', prereqs: ['mlops_fastapi_deploy'] },
        { id: 'ds_distributed_spark', name: 'Distributed Data Engineering with PySpark', prereqs: ['mlops_fastapi_deploy'] },
        { id: 'ds_vector_search_rag', name: 'Vector Search, Embeddings & RAG for Data Science', prereqs: ['nlp_transformers_llm'] },
        { id: 'ds_model_drift_monitoring', name: 'Concept Drift Detection & Continuous Model Monitoring', prereqs: ['mlops_fastapi_deploy'] }
      ]
    }
  },

  cybersecurity: {
    domainId: 'cybersecurity',
    domainName: 'Cybersecurity & Ethical Hacking',
    skills: {
      BEGINNER: [
        { id: 'sec_linux_cli', name: 'Linux Command Line & Systems Basics', prereqs: [] },
        { id: 'sec_win_cli', name: 'Windows CLI & File Privileges', prereqs: ['sec_linux_cli'] },
        { id: 'sec_net_tcpip', name: 'Computer Networking & TCP/IP Protocols', prereqs: ['sec_linux_cli'] },
        { id: 'sec_wireshark_capture', name: 'Wireshark Packet Inspection & Protocols', prereqs: ['sec_net_tcpip'] },
        { id: 'sec_cia_fundamentals', name: 'CIA Triad, Security Governance & Threat Modeling', prereqs: ['sec_linux_cli'] },
        { id: 'sec_dns_dhcp_security', name: 'DNS, DHCP & Core Network Protocol Hardening', prereqs: ['sec_net_tcpip'] },
        { id: 'sec_ports_protocols', name: 'Port Protocols, Service Enumeration & Banner Grabbing', prereqs: ['sec_net_tcpip'] },
        { id: 'sec_crypto_foundations', name: 'Symmetric & Asymmetric Cryptography Basics', prereqs: ['sec_linux_cli'] },
        { id: 'sec_password_hashing', name: 'Password Storage Security, Salting & PBKDF2', prereqs: ['sec_crypto_foundations'] },
        { id: 'sec_os_permissions', name: 'Linux & Windows Permissions, SUID & Access Control', prereqs: ['sec_win_cli'] },
        { id: 'sec_browser_security', name: 'Web Security Foundations & Same-Origin Policy', prereqs: ['sec_net_tcpip'] },
        { id: 'sec_reconnaissance_osint', name: 'Open-Source Intelligence (OSINT) & Digital Footprinting', prereqs: ['sec_linux_cli'] }
      ],
      INTERMEDIATE: [
        { id: 'sec_firewalls_ids', name: 'Firewalls, IDS/IPS & Rule Sets', prereqs: ['sec_net_tcpip'] },
        { id: 'sec_vpn_nmap', name: 'Nmap Scanning & VPN Tunneling', prereqs: ['sec_firewalls_ids'] },
        { id: 'sec_owasp_xss', name: 'Cross-Site Scripting (XSS) & Defenses', prereqs: ['sec_vpn_nmap'] },
        { id: 'sec_sqli_csrf', name: 'SQL Injection & CSRF Attacks', prereqs: ['sec_owasp_xss'] },
        { id: 'sec_crypto_ciphers', name: 'Symmetric & Asymmetric Encryption', prereqs: ['sec_sqli_csrf'] },
        { id: 'sec_vulnerability_scanning', name: 'Automated Vulnerability Scanning with Nessus & OpenVAS', prereqs: ['sec_vpn_nmap'] },
        { id: 'sec_burp_suite_web', name: 'Burp Suite Web Proxying & Request Tampering', prereqs: ['sec_owasp_xss'] },
        { id: 'sec_soc_log_analysis', name: 'SOC Operations, Syslog Analysis & Event Correlation', prereqs: ['sec_firewalls_ids'] },
        { id: 'sec_incident_response_handling', name: 'Incident Response Lifecycles, Triage & Containment', prereqs: ['sec_soc_log_analysis'] },
        { id: 'sec_endpoint_edr', name: 'Endpoint Detection & Response (EDR) Architecture', prereqs: ['sec_firewalls_ids'] },
        { id: 'sec_malware_analysis_basics', name: 'Static & Dynamic Malware Analysis in Sandboxes', prereqs: ['sec_vpn_nmap'] },
        { id: 'sec_iam_oauth_saml', name: 'Identity & Access Management, OAuth 2.0 & SAML', prereqs: ['sec_crypto_ciphers'] }
      ],
      ADVANCED: [
        { id: 'sec_pki_tls', name: 'PKI Certificates & TLS Handshake', prereqs: ['sec_crypto_ciphers'] },
        { id: 'sec_sys_hardening', name: 'Linux/Windows OS Security Hardening', prereqs: ['sec_pki_tls'] },
        { id: 'sec_priv_esc', name: 'Active Directory & Privilege Escalation', prereqs: ['sec_sys_hardening'] },
        { id: 'sec_siem_splunk', name: 'SIEM Log Analysis & Splunk Queries', prereqs: ['sec_priv_esc'] },
        { id: 'sec_forensics_capstone', name: 'Memory Forensics & Incident Response Capstone', prereqs: ['sec_siem_splunk'] },
        { id: 'sec_active_directory_attacks', name: 'Kerberoasting, Pass-the-Hash & BloodHound Mapping', prereqs: ['sec_priv_esc'] },
        { id: 'sec_metasploit_exploitation', name: 'Penetration Testing with Metasploit Framework', prereqs: ['sec_priv_esc'] },
        { id: 'sec_buffer_overflow_exploit', name: 'Buffer Overflows, Memory Corruption & Shellcoding', prereqs: ['sec_sys_hardening'] },
        { id: 'sec_cloud_sec_aws_azure', name: 'AWS & Azure Cloud Security & IAM Role Hardening', prereqs: ['sec_sys_hardening'] },
        { id: 'sec_reverse_engineering_ghidra', name: 'Reverse Engineering with Ghidra & Disassembly', prereqs: ['sec_forensics_capstone'] },
        { id: 'sec_threat_hunting_yara', name: 'Threat Hunting, YARA Signatures & MITRE ATT&CK', prereqs: ['sec_siem_splunk'] },
        { id: 'sec_zero_trust_architecture', name: 'Zero Trust Network Architecture & Microsegmentation', prereqs: ['sec_sys_hardening'] }
      ]
    }
  },

  devops: {
    domainId: 'devops',
    domainName: 'Cloud Engineering & DevOps',
    skills: {
      BEGINNER: [
        { id: 'dev_os_net_basics', name: 'OS Architecture & Networking Protocols', prereqs: [] },
        { id: 'dev_linux_files', name: 'Linux File System & Permissions', prereqs: ['dev_os_net_basics'] },
        { id: 'dev_systemd_services', name: 'Systemd Service Configuration & Process Mgmt', prereqs: ['dev_linux_files'] },
        { id: 'dev_shell_scripting', name: 'Bash Shell Scripting & Automation', prereqs: ['dev_systemd_services'] },
        { id: 'dev_git_fundamentals', name: 'Git Version Control & Repository Collaboration', prereqs: ['dev_os_net_basics'] },
        { id: 'dev_ssh_key_management', name: 'SSH Key Pairs, Bastion Hosts & Secure Shell Access', prereqs: ['dev_linux_files'] },
        { id: 'dev_webserver_nginx_basics', name: 'Nginx Web Server Setup & Reverse Proxy Basics', prereqs: ['dev_systemd_services'] },
        { id: 'dev_virtualization_vms', name: 'Hypervisors, Vagrant & Virtual Machine Provisioning', prereqs: ['dev_os_net_basics'] },
        { id: 'dev_networking_cidr_dns', name: 'CIDR Subnetting, Routing Tables & DNS Records', prereqs: ['dev_os_net_basics'] },
        { id: 'dev_cron_system_automation', name: 'Cron Schedulers, System Timers & Log Rotation', prereqs: ['dev_shell_scripting'] },
        { id: 'dev_package_managers', name: 'Linux Package Managers (APT/YUM) & Compilation', prereqs: ['dev_linux_files'] },
        { id: 'dev_monitoring_basics', name: 'System Metrics & Resource Monitoring (top, htop)', prereqs: ['dev_systemd_services'] }
      ],
      INTERMEDIATE: [
        { id: 'dev_dockerfile_builds', name: 'Dockerfile Optimization & Multi-Stage Builds', prereqs: ['dev_shell_scripting'] },
        { id: 'dev_docker_compose', name: 'Docker Compose & Multi-Container Networking', prereqs: ['dev_dockerfile_builds'] },
        { id: 'dev_git_workflows', name: 'Git Branching & Release Management', prereqs: ['dev_docker_compose'] },
        { id: 'dev_github_actions', name: 'GitHub Actions CI/CD Workflows', prereqs: ['dev_git_workflows'] },
        { id: 'dev_docker_networking_volumes', name: 'Docker Bridge Networks, Storage Volumes & Secrets', prereqs: ['dev_docker_compose'] },
        { id: 'dev_aws_ec2_vpc', name: 'AWS Cloud Foundations: VPC, EC2, S3 & Security Groups', prereqs: ['dev_docker_compose'] },
        { id: 'dev_ansible_playbooks', name: 'Ansible Playbooks, Inventory & Idempotent Config', prereqs: ['dev_shell_scripting'] },
        { id: 'dev_terraform_modules', name: 'Terraform Modules & Cloud Resource Provisioning', prereqs: ['dev_aws_ec2_vpc'] },
        { id: 'dev_prometheus_alertmanager', name: 'Prometheus Metrics Scraping & Alertmanager Rules', prereqs: ['dev_docker_compose'] },
        { id: 'dev_grafana_dashboards', name: 'Grafana Dashboard Visualizations & Observability', prereqs: ['dev_prometheus_alertmanager'] },
        { id: 'dev_ci_pipeline_security', name: 'CI/CD Pipeline Security Scanning with Trivy & SonarQube', prereqs: ['dev_github_actions'] },
        { id: 'dev_artifact_nexus_registry', name: 'Container Registries & Image Lifecycle Policies', prereqs: ['dev_dockerfile_builds'] }
      ],
      ADVANCED: [
        { id: 'dev_k8s_pods_services', name: 'Kubernetes Pods, Deployments & Services', prereqs: ['dev_github_actions'] },
        { id: 'dev_k8s_ingress_helm', name: 'Kubernetes Ingress & Helm Chart Deployment', prereqs: ['dev_k8s_pods_services'] },
        { id: 'dev_terraform_hcl', name: 'Terraform Syntax & HCL State Management', prereqs: ['dev_k8s_ingress_helm'] },
        { id: 'dev_ansible_config', name: 'Ansible Playbooks & Configuration Management', prereqs: ['dev_terraform_hcl'] },
        { id: 'dev_prometheus_grafana', name: 'Prometheus Metrics & Grafana Dashboards', prereqs: ['dev_ansible_config'] },
        { id: 'dev_cloud_sec_capstone', name: 'Cloud Architecture & Disaster Recovery Capstone', prereqs: ['dev_prometheus_grafana'] },
        { id: 'dev_k8s_config_storage', name: 'Kubernetes StatefulSets, PersistentVolumes & ConfigMaps', prereqs: ['dev_k8s_pods_services'] },
        { id: 'dev_k8s_rbac_security', name: 'Kubernetes RBAC, NetworkPolicies & Security Contexts', prereqs: ['dev_k8s_ingress_helm'] },
        { id: 'dev_argocd_gitops', name: 'GitOps Continuous Delivery with ArgoCD & Flux', prereqs: ['dev_k8s_ingress_helm'] },
        { id: 'dev_service_mesh_istio', name: 'Service Mesh Architecture with Istio & Envoy Proxy', prereqs: ['dev_k8s_ingress_helm'] },
        { id: 'dev_sre_slo_sli', name: 'Site Reliability Engineering, SLOs, SLIs & Error Budgets', prereqs: ['dev_prometheus_grafana'] },
        { id: 'dev_multi_cloud_dr', name: 'Multi-Region Disaster Recovery & Infrastructure Resilience', prereqs: ['dev_cloud_sec_capstone'] }
      ]
    }
  },

  dsa: {
    domainId: 'dsa',
    domainName: 'Data Structures & Algorithms (Interview Prep)',
    skills: {
      BEGINNER: [
        { id: 'dsa_programming_basics', name: 'Programming Basics', prereqs: [] },
        { id: 'dsa_control_flow', name: 'Conditionals, Loops & Basic Problems', prereqs: ['dsa_programming_basics'] },
        { id: 'dsa_functions_arrays_strings', name: 'Functions, Arrays & Strings', prereqs: ['dsa_control_flow'] },
        { id: 'dsa_big_o_analysis', name: 'Big-O Time & Space Complexity', prereqs: ['dsa_functions_arrays_strings'] },
        { id: 'dsa_recursion_basics', name: 'Recursion Fundamentals & Call Stack', prereqs: ['dsa_big_o_analysis'] },
        { id: 'dsa_array_hashmaps', name: 'Array Mutation & Hash Map O(1) Lookups', prereqs: ['dsa_big_o_analysis'] },
        { id: 'dsa_two_pointers', name: 'Two Pointers Technique & In-Place Mutation', prereqs: ['dsa_array_hashmaps'] },
        { id: 'dsa_sliding_window', name: 'Sliding Window (Fixed & Dynamic)', prereqs: ['dsa_two_pointers'] },
        { id: 'dsa_linear_binary_search', name: 'Binary Search & Search Space Reduction', prereqs: ['dsa_big_o_analysis'] },
        { id: 'dsa_sorting_algorithms', name: 'Merge Sort, Quick Sort & In-Place Partitioning', prereqs: ['dsa_recursion_basics'] },
        { id: 'dsa_matrix_traversal', name: '2D Matrices, Spiral Traversal & Grid Rotations', prereqs: ['dsa_functions_arrays_strings'] },
        { id: 'dsa_bitwise_manipulation', name: 'Bitwise Operators, Bitmasks & Power-of-Two Tricks', prereqs: ['dsa_control_flow'] }
      ],
      INTERMEDIATE: [
        { id: 'dsa_floyd_pointers', name: 'Fast & Slow Pointers (Cycle Detection)', prereqs: ['dsa_sliding_window'] },
        { id: 'dsa_stacks_parentheses', name: 'Stack LIFO Operations & Valid Parentheses', prereqs: ['dsa_floyd_pointers'] },
        { id: 'dsa_monotonic_stacks', name: 'Monotonic Stack Pattern', prereqs: ['dsa_stacks_parentheses'] },
        { id: 'dsa_bst_operations', name: 'Binary Search Tree Search & In-Order Traversal', prereqs: ['dsa_monotonic_stacks'] },
        { id: 'dsa_heaps_priority', name: 'Min/Max Heap & Priority Queue', prereqs: ['dsa_bst_operations'] },
        { id: 'dsa_linked_list_reversal', name: 'Linked List Reversal, Merging & Reordering', prereqs: ['dsa_floyd_pointers'] },
        { id: 'dsa_queues_deques', name: 'Queues, Deques & Sliding Window Maximum', prereqs: ['dsa_stacks_parentheses'] },
        { id: 'dsa_tree_traversals', name: 'Binary Tree Traversals (Level-Order & Recursive)', prereqs: ['dsa_bst_operations'] },
        { id: 'dsa_tree_lowest_common_ancestor', name: 'Lowest Common Ancestor & Path Sum Analysis', prereqs: ['dsa_tree_traversals'] },
        { id: 'dsa_backtracking_subsets', name: 'Backtracking: Subsets, Permutations & Combinations', prereqs: ['dsa_recursion_basics'] },
        { id: 'dsa_greedy_interval_scheduling', name: 'Greedy Algorithms & Interval Scheduling', prereqs: ['dsa_heaps_priority'] },
        { id: 'dsa_trie_prefix_trees', name: 'Trie Data Structure & Prefix Matching', prereqs: ['dsa_bst_operations'] }
      ],
      ADVANCED: [
        { id: 'dsa_bfs_dfs_traversal', name: 'Breadth-First & Depth-First Graph Search', prereqs: ['dsa_heaps_priority'] },
        { id: 'dsa_dijkstra_shortest', name: 'Dijkstra Shortest Path & Topological Sort', prereqs: ['dsa_bfs_dfs_traversal'] },
        { id: 'dsa_dp_memo_tabulation', name: 'Dynamic Programming Memoization vs Tabulation', prereqs: ['dsa_dijkstra_shortest'] },
        { id: 'dsa_dp_knapsack_lcs', name: '0/1 Knapsack & Longest Common Subsequence', prereqs: ['dsa_dp_memo_tabulation'] },
        { id: 'dsa_graph_topological_sort', name: 'Directed Acyclic Graphs & Course Scheduling', prereqs: ['dsa_bfs_dfs_traversal'] },
        { id: 'dsa_graph_union_find_mst', name: 'Disjoint Set Union (DSU) & Kruskal Minimum Spanning Tree', prereqs: ['dsa_bfs_dfs_traversal'] },
        { id: 'dsa_bellman_ford_floyd_warshall', name: 'Shortest Path: Bellman-Ford & Floyd-Warshall', prereqs: ['dsa_dijkstra_shortest'] },
        { id: 'dsa_dp_interval_partition', name: 'Matrix Chain Multiplication & Palindrome Partitioning', prereqs: ['dsa_dp_memo_tabulation'] },
        { id: 'dsa_dp_bitmask_tsp', name: 'Bitmask Dynamic Programming & Combinatorial Optimization', prereqs: ['dsa_dp_knapsack_lcs'] },
        { id: 'dsa_segment_trees_range_query', name: 'Segment Trees, Lazy Propagation & Range Queries', prereqs: ['dsa_bst_operations'] },
        { id: 'dsa_fenwick_binary_indexed_tree', name: 'Fenwick Tree / Binary Indexed Tree Prefix Sums', prereqs: ['dsa_segment_trees_range_query'] },
        { id: 'dsa_advanced_string_kmp', name: 'KMP String Matching & Rabin-Karp Rolling Hash', prereqs: ['dsa_dp_memo_tabulation'] }
      ]
    }
  },

  mobile: {
    domainId: 'mobile',
    domainName: 'Mobile App Development (React Native & Flutter)',
    skills: {
      BEGINNER: [
        { id: 'mob_lang_syntax', name: 'JavaScript/Dart Mobile Syntax', prereqs: [] },
        { id: 'mob_async_dart_js', name: 'Asynchronous Programming in Mobile Apps', prereqs: ['mob_lang_syntax'] },
        { id: 'mob_flexbox_ui', name: 'Mobile Screen Layouts & Flexbox Engine', prereqs: ['mob_lang_syntax'] },
        { id: 'mob_widgets_components', name: 'Reusable Custom Mobile UI Components', prereqs: ['mob_flexbox_ui'] },
        { id: 'mob_ui_design_principles', name: 'Mobile UI Principles, Safe Areas & Platform Conventions', prereqs: ['mob_flexbox_ui'] },
        { id: 'mob_touch_inputs_buttons', name: 'Touch Inputs, Pressables & Gesture Responders', prereqs: ['mob_widgets_components'] },
        { id: 'mob_scrolling_lists', name: 'FlatList, ScrollView & Virtualized List Performance', prereqs: ['mob_widgets_components'] },
        { id: 'mob_form_inputs_validation', name: 'TextInput Controls, Keyboard Avoidance & Validation', prereqs: ['mob_touch_inputs_buttons'] },
        { id: 'mob_images_asset_bundling', name: 'Image Caching, Vector Icons & Asset Bundles', prereqs: ['mob_widgets_components'] },
        { id: 'mob_device_orientation_responsive', name: 'Responsive Layouts & Screen Orientation Handling', prereqs: ['mob_flexbox_ui'] },
        { id: 'mob_local_state_hooks', name: 'Local Component State & Hook Lifecycles', prereqs: ['mob_widgets_components'] },
        { id: 'mob_theme_dark_mode', name: 'Light & Dark Theme Switching with Dynamic Styling', prereqs: ['mob_local_state_hooks'] }
      ],
      INTERMEDIATE: [
        { id: 'mob_state_management', name: 'Redux / Provider / Context State Management', prereqs: ['mob_widgets_components'] },
        { id: 'mob_navigation_routing', name: 'Stack, Tab & Deep Link Navigation', prereqs: ['mob_state_management'] },
        { id: 'mob_camera_location_api', name: 'Camera & Geolocation Device APIs', prereqs: ['mob_navigation_routing'] },
        { id: 'mob_push_notifications', name: 'Firebase Cloud Messaging (FCM) & Push Alerts', prereqs: ['mob_camera_location_api'] },
        { id: 'mob_local_db_storage', name: 'AsyncStorage & SQLite Local Databases', prereqs: ['mob_push_notifications'] },
        { id: 'mob_network_rest_http', name: 'Networking, Axios/HTTP Client & API Error Handling', prereqs: ['mob_state_management'] },
        { id: 'mob_sqlite_room_offline', name: 'SQLite / Room Embedded Database & Local CRUD', prereqs: ['mob_local_db_storage'] },
        { id: 'mob_redux_toolkit_bloc', name: 'Global State Architecture: Redux Toolkit & Bloc Pattern', prereqs: ['mob_state_management'] },
        { id: 'mob_deep_linking_routing', name: 'Universal Links & Deep Linking Navigation Architecture', prereqs: ['mob_navigation_routing'] },
        { id: 'mob_animations_reanimated', name: 'Fluid Animations with React Native Reanimated & Gestures', prereqs: ['mob_navigation_routing'] },
        { id: 'mob_biometric_hardware_auth', name: 'Biometric Fingerprint & FaceID Authentication', prereqs: ['mob_camera_location_api'] },
        { id: 'mob_offline_sync_architecture', name: 'Offline-First Architecture & Network Sync Queue', prereqs: ['mob_local_db_storage'] }
      ],
      ADVANCED: [
        { id: 'mob_perf_profiling', name: 'FPS Optimization & Memory Leak Profiling', prereqs: ['mob_local_db_storage'] },
        { id: 'mob_oauth_keychain', name: 'OAuth 2.0 & Secure Keychain Storage', prereqs: ['mob_perf_profiling'] },
        { id: 'mob_biometric_auth', name: 'Biometric Auth & SSL Pinning Security', prereqs: ['mob_oauth_keychain'] },
        { id: 'mob_fastlane_signing', name: 'Fastlane Automation & Code Signing', prereqs: ['mob_biometric_auth'] },
        { id: 'mob_store_submission_capstone', name: 'App Store & Play Store Submission Capstone', prereqs: ['mob_fastlane_signing'] },
        { id: 'mob_native_modules_cxx', name: 'Native Modules, TurboModules & JSI C++ Bridge Integration', prereqs: ['mob_perf_profiling'] },
        { id: 'mob_memory_leak_profiling', name: 'Memory Leak Profiling with Android Studio & Xcode', prereqs: ['mob_perf_profiling'] },
        { id: 'mob_code_push_ota', name: 'Over-The-Air (OTA) Updates & Hot-Patching Workflows', prereqs: ['mob_fastlane_signing'] },
        { id: 'mob_security_ssl_pinning', name: 'Mobile App Security, SSL Pinning & Keystore Hardening', prereqs: ['mob_biometric_auth'] },
        { id: 'mob_webrtc_audio_video', name: 'WebRTC Real-Time Audio & Video Streaming Engine', prereqs: ['mob_perf_profiling'] },
        { id: 'mob_ci_cd_fastlane_github', name: 'Automated Build & Test CI/CD Pipelines with Fastlane', prereqs: ['mob_fastlane_signing'] },
        { id: 'mob_app_store_play_store_deployment', name: 'Google Play & Apple App Store Release Management', prereqs: ['mob_store_submission_capstone'] }
      ]
    }
  },

  ai_llm: {
    domainId: 'ai_llm',
    domainName: 'AI & LLM Systems Engineering',
    skills: {
      BEGINNER: [
        { id: 'ai_math_vectors', name: 'Linear Algebra, Matrices & Vector Math', prereqs: [] },
        { id: 'ai_python_apis', name: 'Python LLM SDKs & API Requests', prereqs: ['ai_math_vectors'] },
        { id: 'ai_prompt_design', name: 'System Prompts & Context Window Allocation', prereqs: ['ai_python_apis'] },
        { id: 'ai_structured_json', name: 'Structured JSON Schemas & Output Parsing', prereqs: ['ai_prompt_design'] },
        { id: 'ai_linear_algebra_matrices', name: 'Matrix Multiplications, Dot Products & Cosine Similarity', prereqs: ['ai_math_vectors'] },
        { id: 'ai_probability_distributions', name: 'Probability Distributions & Softmax Mechanics', prereqs: ['ai_math_vectors'] },
        { id: 'ai_tokenization_bpe', name: 'Text Tokenization, Byte-Pair Encoding & Vocabularies', prereqs: ['ai_python_apis'] },
        { id: 'ai_llm_inference_params', name: 'LLM Inference Parameters: Temperature, Top-P & Top-K', prereqs: ['ai_prompt_design'] },
        { id: 'ai_few_shot_prompting', name: 'In-Context Learning, Few-Shot & Chain-of-Thought Prompting', prereqs: ['ai_prompt_design'] },
        { id: 'ai_vector_math_embeddings', name: 'Vector Embeddings & Semantic Distance Fundamentals', prereqs: ['ai_math_vectors'] },
        { id: 'ai_huggingface_pipelines', name: 'Hugging Face Inference Pipelines & Model Hub Setup', prereqs: ['ai_python_apis'] },
        { id: 'ai_vector_db_chroma', name: 'ChromaDB Vector Store Setup & Document Indexing', prereqs: ['ai_vector_math_embeddings'] }
      ],
      INTERMEDIATE: [
        { id: 'ai_vector_embeddings', name: 'Text Vector Embeddings & Similarity Metrics', prereqs: ['ai_structured_json'] },
        { id: 'ai_vector_dbs_pinecone', name: 'Pinecone, ChromaDB & HNSW Vector Indexing', prereqs: ['ai_vector_embeddings'] },
        { id: 'ai_rag_chunking', name: 'Document Chunking Strategies & Ingestion', prereqs: ['ai_vector_dbs_pinecone'] },
        { id: 'ai_rag_architecture_foundations', name: 'Retrieval-Augmented Generation Architecture & Query Synthesis', prereqs: ['ai_rag_chunking'] },
        { id: 'ai_advanced_chunking_strategies', name: 'Recursive Character & Semantic Markdown Chunking', prereqs: ['ai_rag_chunking'] },
        { id: 'ai_langchain_chains_runnables', name: 'LangChain Expression Language (LCEL) & Sequential Chains', prereqs: ['ai_rag_architecture_foundations'] },
        { id: 'ai_llamaindex_document_indexes', name: 'LlamaIndex Hierarchical Indexing & Data Connectors', prereqs: ['ai_rag_architecture_foundations'] },
        { id: 'ai_function_calling_tools', name: 'LLM Function Calling, Tools Binding & API Integrations', prereqs: ['ai_structured_json'] },
        { id: 'ai_multimodal_vision_apis', name: 'Multimodal Vision & Audio Inference with Gemini/GPT-4V', prereqs: ['ai_structured_json'] },
        { id: 'ai_rag_evaluation_ragas', name: 'RAG Evaluation Frameworks: Ragas, Faithfulness & Relevancy', prereqs: ['ai_rag_architecture_foundations'] },
        { id: 'ai_peft_lora_finetuning', name: 'Parameter-Efficient Fine-Tuning with LoRA & QLoRA', prereqs: ['ai_vector_embeddings'] },
        { id: 'ai_synthetic_data_generation', name: 'Synthetic Data Generation & Data Curation for LLMs', prereqs: ['ai_structured_json'] }
      ],
      ADVANCED: [
        { id: 'ai_hybrid_search_rerank', name: 'Hybrid Search & Cross-Encoder Re-Ranking', prereqs: ['ai_rag_chunking'] },
        { id: 'ai_lora_fine_tuning', name: 'LoRA & QLoRA Parameter Efficient Tuning', prereqs: ['ai_hybrid_search_rerank'] },
        { id: 'ai_quantization_serving', name: 'Model Quantization (GGUF) & Local Ollama', prereqs: ['ai_lora_fine_tuning'] },
        { id: 'ai_react_agent_loop', name: 'ReAct Agent Execution Loop Architecture', prereqs: ['ai_quantization_serving'] },
        { id: 'ai_tool_calling_schema', name: 'Function Calling & Schema Tool Binding', prereqs: ['ai_react_agent_loop'] },
        { id: 'ai_guardrails_nemo', name: 'NeMo Guardrails & Hallucination Prevention', prereqs: ['ai_tool_calling_schema'] },
        { id: 'ai_llm_eval_capstone', name: 'End-to-End LLM Agent Systems Capstone', prereqs: ['ai_guardrails_nemo'] },
        { id: 'ai_multi_agent_orchestration', name: 'Multi-Agent Swarms, Supervisor Agents & LangGraph State Machines', prereqs: ['ai_react_agent_loop'] },
        { id: 'ai_vllm_paged_attention', name: 'vLLM High-Throughput Serving, PagedAttention & Continuous Batching', prereqs: ['ai_quantization_serving'] },
        { id: 'ai_transformer_self_attention', name: 'Transformer Self-Attention, Multi-Head & FlashAttention Mechanics', prereqs: ['ai_lora_fine_tuning'] },
        { id: 'ai_rlhf_dpo_alignment', name: 'Model Alignment with Direct Preference Optimization (DPO) & RLHF', prereqs: ['ai_lora_fine_tuning'] },
        { id: 'ai_llm_security_jailbreak_defense', name: 'Adversarial Prompt Injection Defense & Enterprise Security Guardrails', prereqs: ['ai_guardrails_nemo'] }
      ]
    }
  },

  system_design: {
    domainId: 'system_design',
    domainName: 'System Design & Distributed Architecture',
    skills: {
      BEGINNER: [
        { id: 'sd_http_client_server', name: 'Client-Server Principles & HTTP/HTTPS', prereqs: [] },
        { id: 'sd_web_servers_sockets', name: 'Web Servers & WebSockets Architecture', prereqs: ['sd_http_client_server'] },
        { id: 'sd_load_balancers', name: 'Layer 4 vs Layer 7 Load Balancing', prereqs: ['sd_web_servers_sockets'] },
        { id: 'sd_dns_cdn_fundamentals', name: 'DNS Resolution, Anycast & Global CDN Edge Caching', prereqs: ['sd_http_client_server'] },
        { id: 'sd_stateless_architecture', name: 'Stateless Web Tier Design & Session State Offloading', prereqs: ['sd_web_servers_sockets'] },
        { id: 'sd_database_sql_vs_nosql', name: 'Relational SQL vs NoSQL Data Model Selection', prereqs: ['sd_http_client_server'] },
        { id: 'sd_caching_strategies', name: 'Cache Strategies: Cache-Aside, Write-Through & Eviction LRU', prereqs: ['sd_web_servers_sockets'] },
        { id: 'sd_api_design_rest_grpc', name: 'API Architecture Trade-Offs: REST, GraphQL & gRPC', prereqs: ['sd_http_client_server'] },
        { id: 'sd_vertical_horizontal_scaling', name: 'Vertical vs Horizontal Scaling & Bottleneck Identification', prereqs: ['sd_load_balancers'] },
        { id: 'sd_database_indexing_btree', name: 'Database B-Tree Indexing, Query Optimization & Execution Plans', prereqs: ['sd_database_sql_vs_nosql'] },
        { id: 'sd_rate_limiting_algorithms', name: 'Rate Limiting: Token Bucket, Leaky Bucket & Sliding Window', prereqs: ['sd_load_balancers'] },
        { id: 'sd_metrics_logging_telemetry', name: 'Telemetry, Structured Logging & System Monitoring Fundamentals', prereqs: ['sd_web_servers_sockets'] }
      ],
      INTERMEDIATE: [
        { id: 'sd_consistent_hashing', name: 'Consistent Hashing & Stateless App Nodes', prereqs: ['sd_load_balancers'] },
        { id: 'sd_redis_cache_aside', name: 'Redis In-Memory Store & Cache Patterns', prereqs: ['sd_consistent_hashing'] },
        { id: 'sd_cdn_invalidation', name: 'Content Delivery Networks (CDNs)', prereqs: ['sd_redis_cache_aside'] },
        { id: 'sd_read_replicas', name: 'Master-Slave Read Replicas & Replication Lag', prereqs: ['sd_cdn_invalidation'] },
        { id: 'sd_sharding_cap_theorem', name: 'Database Horizontal Sharding & CAP Theorem', prereqs: ['sd_read_replicas'] },
        { id: 'sd_rabbitmq_queues', name: 'Message Queues (RabbitMQ & Task Deferral)', prereqs: ['sd_sharding_cap_theorem'] },
        { id: 'sd_cap_pacelc_tradeoffs', name: 'CAP Theorem & PACELC Distributed Guarantees', prereqs: ['sd_sharding_cap_theorem'] },
        { id: 'sd_database_partitioning_sharding', name: 'Horizontal Sharding, Range-Based vs Hash-Based Keys', prereqs: ['sd_sharding_cap_theorem'] },
        { id: 'sd_message_brokers_kafka', name: 'Kafka Partitioning, Consumer Groups & Exactly-Once Semantics', prereqs: ['sd_rabbitmq_queues'] },
        { id: 'sd_distributed_id_generation', name: 'Distributed Unique ID Generators: Twitter Snowflake Design', prereqs: ['sd_consistent_hashing'] },
        { id: 'sd_search_indexing_elasticsearch', name: 'Inverted Indexing & Distributed Search with Elasticsearch', prereqs: ['sd_redis_cache_aside'] },
        { id: 'sd_websocket_realtime_clusters', name: 'Real-Time WebSocket Gateway Clustering & Redis Pub/Sub', prereqs: ['sd_rabbitmq_queues'] }
      ],
      ADVANCED: [
        { id: 'sd_kafka_streaming', name: 'Event Streaming (Apache Kafka Partitioning)', prereqs: ['sd_rabbitmq_queues'] },
        { id: 'sd_consensus_raft', name: 'Consensus Algorithms (Raft Protocol)', prereqs: ['sd_kafka_streaming'] },
        { id: 'sd_distributed_locks', name: 'Distributed Locking & Saga Transactions', prereqs: ['sd_consensus_raft'] },
        { id: 'sd_service_mesh', name: 'Service Mesh (Istio) & Circuit Breakers', prereqs: ['sd_distributed_locks'] },
        { id: 'sd_api_gateway_capstone', name: 'API Gateway Routing & System Design Capstone', prereqs: ['sd_service_mesh'] },
        { id: 'sd_two_phase_commit_saga', name: 'Distributed Transactions: Two-Phase Commit & Saga Orchestration', prereqs: ['sd_distributed_locks'] },
        { id: 'sd_cqrs_event_sourcing', name: 'Command Query Responsibility Segregation (CQRS) & Event Sourcing', prereqs: ['sd_kafka_streaming'] },
        { id: 'sd_design_distributed_cache', name: 'Designing a Distributed In-Memory Cache from Scratch', prereqs: ['sd_consensus_raft'] },
        { id: 'sd_design_url_shortener_scale', name: 'Designing High-Scale URL Shortener with 100M Daily Requests', prereqs: ['sd_kafka_streaming'] },
        { id: 'sd_design_video_streaming_youtube', name: 'High-Scale Video Transcoding & Chunked Adaptive Streaming', prereqs: ['sd_service_mesh'] },
        { id: 'sd_design_chat_whatsapp', name: 'End-to-End Encrypted Real-Time Chat System Architecture', prereqs: ['sd_distributed_locks'] },
        { id: 'sd_chaos_resilience_multi_region', name: 'Chaos Engineering, Circuit Breakers & Multi-Region Failover', prereqs: ['sd_api_gateway_capstone'] }
      ]
    }
  }
};

// Build Knowledge Graphs JSON structure
const DOMAIN_KNOWLEDGE_GRAPHS = {};

for (const [domainKey, domainInfo] of Object.entries(domainsData)) {
  const topics = [];

  ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].forEach(diff => {
    const skillsList = domainInfo.skills[diff] || [];
    const topicId = `${domainKey}_top_${diff.toLowerCase()}`;
    const topicName = `${domainInfo.domainName} — ${diff.charAt(0) + diff.slice(1).toLowerCase()} Tier`;

    // Group into subtopics of 3-4 skills
    const subtopics = [];
    for (let i = 0; i < skillsList.length; i += 4) {
      const chunk = skillsList.slice(i, i + 4);
      const subtopicId = `${domainKey}_sub_${diff.toLowerCase()}_${Math.floor(i / 4) + 1}`;
      const subtopicName = `${chunk[0].name.split('&')[0].trim()} & Core Concepts`;

      subtopics.push({
        id: subtopicId,
        name: subtopicName,
        skills: chunk.map(sk => ({
          skillId: sk.id,
          skillName: sk.name,
          prerequisites: sk.prereqs,
          difficulty: diff,
          estimatedHours: diff === 'BEGINNER' ? 4 : (diff === 'INTERMEDIATE' ? 6 : 8),
          subskills: makeSubskills(sk.id, sk.name, diff)
        }))
      });
    }

    topics.push({
      id: topicId,
      name: topicName,
      subtopics
    });
  });

  DOMAIN_KNOWLEDGE_GRAPHS[domainKey] = {
    domainId: domainInfo.domainId,
    domainName: domainInfo.domainName,
    topics
  };
}

// Write the complete engine/knowledgeGraph.js file
const fileContent = `/**
 * Knowledge Graph Engine for AgPlacify
 * Domain-independent, prerequisite-aware skill graph structure supporting arbitrary domains.
 * Hierarchy: Domain -> Topics -> Subtopics -> Skills/Concepts -> Subskills -> (Prerequisites, Difficulty, Learning Dependencies)
 * Expanded to 36 skills per domain (12 Beginner, 12 Intermediate, 12 Advanced) for 100% 6-month roadmap completeness.
 */

const DOMAIN_KNOWLEDGE_GRAPHS = ${JSON.stringify(DOMAIN_KNOWLEDGE_GRAPHS, null, 2)};

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
        id: \`\${domainKey}_topic_fund\`,
        name: \`\${sanitizedDomain} Fundamentals\`,
        subtopics: [
          {
            id: \`\${domainKey}_sub_basics\`,
            name: 'Core Concepts & Tooling',
            skills: [
              {
                skillId: \`\${domainKey}_basics\`,
                skillName: \`\${sanitizedDomain} Core Principles\`,
                prerequisites: [],
                difficulty: 'BEGINNER',
                estimatedHours: 4,
                subskills: [
                  { subskillId: \`\${domainKey}_sub_concept1\`, subskillName: \`\${sanitizedDomain} Foundation Overview\`, skillName: \`\${sanitizedDomain} Foundation Overview\`, prerequisites: [], difficulty: 'BEGINNER', estimatedMinutes: 45 },
                  { subskillId: \`\${domainKey}_sub_concept2\`, subskillName: \`\${sanitizedDomain} Applied Syntax\`, skillName: \`\${sanitizedDomain} Applied Syntax\`, prerequisites: [\`\${domainKey}_sub_concept1\`], difficulty: 'BEGINNER', estimatedMinutes: 45 }
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
    const sName = sub.subskillName || sub.skillName || \`\${baseName} Part \${idx + 1}\`;
    return {
      ...sub,
      subskillId: sub.subskillId || sub.skillId || \`\${skillNode.skillId}_sub_\${idx + 1}\`,
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
    const aspect = aspectNames[nextIdx - 1] || \`Advanced Skill Aspect \${nextIdx}\`;
    const newSubId = \`\${skillNode.skillId}_sub_\${nextIdx}\`;
    const newSubName = \`\${baseName}: \${aspect}\`;

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
`;

const targetPath = path.join(__dirname, '..', 'engine', 'knowledgeGraph.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully wrote updated engine/knowledgeGraph.js!');
