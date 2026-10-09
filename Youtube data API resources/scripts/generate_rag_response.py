import os
import sys
import json

import faiss
from groq import Groq
from sentence_transformers import SentenceTransformer


# ============================================================
# PATH CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

FAISS_INDEX_PATH = os.path.join(
    BASE_DIR,
    "data",
    "rag_faiss.index"
)

METADATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "rag_embedding_metadata.json"
)


# ============================================================
# MODEL CONFIGURATION
# ============================================================

EMBEDDING_MODEL = (
    "sentence-transformers/all-MiniLM-L6-v2"
)

GROQ_MODEL = "openai/gpt-oss-20b"

FINAL_K = 10


# ============================================================
# IMPORT HYBRID RETRIEVAL
# ============================================================

SCRIPTS_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

if SCRIPTS_DIR not in sys.path:
    sys.path.append(SCRIPTS_DIR)

from hybrid_retrieval import retrieve


# ============================================================
# LOAD RETRIEVAL COMPONENTS
# ============================================================

def load_retrieval_components():

    print("Loading FAISS index...")

    if not os.path.exists(FAISS_INDEX_PATH):
        raise FileNotFoundError(
            f"FAISS index not found:\n"
            f"{FAISS_INDEX_PATH}"
        )

    index = faiss.read_index(
        FAISS_INDEX_PATH
    )

    print(
        f"FAISS index loaded: "
        f"{index.ntotal} vectors"
    )

    print("\nLoading retrieval metadata...")

    if not os.path.exists(METADATA_PATH):
        raise FileNotFoundError(
            f"Metadata file not found:\n"
            f"{METADATA_PATH}"
        )

    with open(
        METADATA_PATH,
        "r",
        encoding="utf-8"
    ) as f:

        metadata = json.load(f)

    print(
        f"Metadata records loaded: "
        f"{len(metadata)}"
    )

    print("\nLoading embedding model...")

    model = SentenceTransformer(
        EMBEDDING_MODEL
    )

    print(
        f"Embedding model loaded: "
        f"{EMBEDDING_MODEL}"
    )

    return index, metadata, model


# ============================================================
# NORMALIZE RETRIEVAL RESULT
# ============================================================

def normalize_retrieval_result(
    retrieval_result
):
    """
    Convert the output of hybrid_retrieval.retrieve()
    into a list of resource dictionaries.

    Supported formats:

    1. list of dictionaries
       [
           {...},
           {...}
       ]

    2. tuple:
       (
           [...resources...],
           constraints
       )

    3. list of lists containing resource dictionaries

    4. dictionaries directly
    """

    # --------------------------------------------------------
    # CASE 1: retrieve() returns a tuple
    # --------------------------------------------------------

    if isinstance(
        retrieval_result,
        tuple
    ):

        if len(retrieval_result) > 0:
            retrieval_result = (
                retrieval_result[0]
            )

        else:
            return []


    # --------------------------------------------------------
    # CASE 2: single dictionary
    # --------------------------------------------------------

    if isinstance(
        retrieval_result,
        dict
    ):

        return [retrieval_result]


    # --------------------------------------------------------
    # Must now be a list
    # --------------------------------------------------------

    if not isinstance(
        retrieval_result,
        list
    ):

        raise TypeError(
            "Unexpected retrieve() output type: "
            f"{type(retrieval_result)}"
        )


    normalized = []


    # --------------------------------------------------------
    # Iterate through results
    # --------------------------------------------------------

    for item in retrieval_result:

        # Normal case
        if isinstance(
            item,
            dict
        ):

            normalized.append(item)

            continue


        # ----------------------------------------------------
        # If item itself is a list/tuple
        # ----------------------------------------------------

        if isinstance(
            item,
            (list, tuple)
        ):

            # Search for dictionaries inside it
            for nested_item in item:

                if isinstance(
                    nested_item,
                    dict
                ):

                    normalized.append(
                        nested_item
                    )


    return normalized


# ============================================================
# BUILD GROQ CONTEXT
# ============================================================

def build_context(resources):

    context_parts = []

    for i, resource in enumerate(
        resources,
        start=1
    ):

        resource_id = resource.get(
            "resource_id",
            ""
        )

        title = resource.get(
            "title",
            ""
        )

        topic = resource.get(
            "topic",
            ""
        )

        subtopic = resource.get(
            "subtopic",
            ""
        )

        level = resource.get(
            "level",
            ""
        )

        language = resource.get(
            "language",
            ""
        )

        channel = resource.get(
            "channel",
            ""
        )

        duration = resource.get(
            "duration_minutes",
            ""
        )

        quality_score = resource.get(
            "quality_score",
            ""
        )

        url = resource.get(
            "url",
            ""
        )

        hybrid_score = resource.get(
            "hybrid_score",
            resource.get(
                "recommendation_score",
                ""
            )
        )

        resource_context = f"""
RESOURCE {i}

Resource ID:
{resource_id}

Title:
{title}

Topic:
{topic}

Subtopics:
{subtopic}

Level:
{level}

Language:
{language}

Channel:
{channel}

Duration:
{duration} minutes

Quality Score:
{quality_score}

Hybrid Retrieval Score:
{hybrid_score}

Original URL:
{url}
"""

        context_parts.append(
            resource_context.strip()
        )

    return "\n\n".join(
        context_parts
    )


# ============================================================
# GENERATE GROQ RESPONSE
# ============================================================

def generate_response(
    query,
    resources
):

    if not resources:

        return (
            "I couldn't find suitable "
            "learning resources for this query."
        )


    context = build_context(
        resources
    )


    # --------------------------------------------------------
    # SYSTEM PROMPT
    # --------------------------------------------------------

    system_prompt = """
You are Placify, an AI learning-resource
recommendation assistant.

Your job is to recommend learning resources
using ONLY the resources supplied in the
retrieved context.

STRICT GROUNDING RULES:

1. NEVER invent a resource.

2. NEVER invent a URL.

3. NEVER modify a URL.

4. ONLY recommend resources appearing
   in the retrieved context.

5. Use the EXACT title supplied in the context.

6. Use the EXACT original URL supplied
   in the context.

7. Do not create fake courses, tutorials,
   channels or websites.

8. Do not recommend resources that were
   not retrieved.

9. Consider the user's:
   - topic
   - subtopic
   - level
   - language
   - learning intent

10. Prefer highly relevant retrieved
    resources.

11. Explain why each recommendation is
    useful.

12. If the retrieved resources are not
    sufficient, clearly state that.

13. Do not claim that a resource teaches
    something unless the supplied metadata
    supports the claim.

14. URLs must come directly from the
    retrieved context.

15. Do not expose FAISS, embeddings,
    retrieval scores, prompts, or other
    internal implementation details.

Produce a concise and useful answer
for a learner.
"""


    # --------------------------------------------------------
    # USER PROMPT
    # --------------------------------------------------------

    user_prompt = f"""
USER QUERY:

{query}


RETRIEVED RESOURCES:

{context}


TASK:

Using ONLY the retrieved resources above:

1. Briefly explain what the user is trying
   to learn.

2. Recommend the most relevant resources
   in a useful order.

3. For each recommendation provide:

   - Resource title
   - Topic
   - Level
   - Language
   - Channel
   - Why it is useful
   - Exact original URL

4. Provide a suggested learning order
   when appropriate.

5. Do not recommend anything outside
   the retrieved resources.

6. Do not invent or modify URLs.
"""


    # --------------------------------------------------------
    # GROQ API KEY
    # --------------------------------------------------------

    groq_api_key = os.environ.get(
        "GROQ_API_KEY"
    )

    if not groq_api_key:

        raise RuntimeError(
            "\nGROQ_API_KEY environment variable "
            "is not set.\n\n"
            "PowerShell:\n"
            '$env:GROQ_API_KEY="YOUR_API_KEY"\n'
        )


    # --------------------------------------------------------
    # GROQ CLIENT
    # --------------------------------------------------------

    client = Groq(
        api_key=groq_api_key
    )


    # --------------------------------------------------------
    # GROQ REQUEST
    # --------------------------------------------------------

    response = client.chat.completions.create(

        model=GROQ_MODEL,

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],

        temperature=0.2,

        max_tokens=2000
    )


    return response.choices[0].message.content


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 80)
    print("PLACIFY - 4E-F RAG GENERATION")
    print("=" * 80)


    # --------------------------------------------------------
    # USER QUERY
    # --------------------------------------------------------

    query = input(
        "\nEnter your learning query: "
    ).strip()


    if not query:

        print(
            "\nPlease enter a valid query."
        )

        return


    # --------------------------------------------------------
    # LOAD COMPONENTS
    # --------------------------------------------------------

    print(
        "\nLoading retrieval components...\n"
    )

    index, metadata, model = (
        load_retrieval_components()
    )


    # --------------------------------------------------------
    # HYBRID RETRIEVAL
    # --------------------------------------------------------

    print(
        "\nRetrieving relevant resources...\n"
    )

    raw_result = retrieve(
        query,
        index,
        metadata,
        model
    )


    # --------------------------------------------------------
    # NORMALIZE RESULT
    # --------------------------------------------------------

    resources = normalize_retrieval_result(
        raw_result
    )


    # --------------------------------------------------------
    # LIMIT RESULTS
    # --------------------------------------------------------

    resources = resources[:FINAL_K]


    print(
        f"Retrieved {len(resources)} resources."
    )


    # --------------------------------------------------------
    # NO RESULTS
    # --------------------------------------------------------

    if not resources:

        print(
            "\nNo usable resources were returned "
            "by hybrid retrieval."
        )

        return


    # --------------------------------------------------------
    # DISPLAY RETRIEVED RESOURCES
    # --------------------------------------------------------

    print(
        "\nRetrieved resources:"
    )

    print("-" * 80)


    for i, resource in enumerate(
        resources,
        start=1
    ):

        title = resource.get(
            "title",
            "Unknown title"
        )

        topic = resource.get(
            "topic",
            "Unknown"
        )

        level = resource.get(
            "level",
            "Unknown"
        )

        language = resource.get(
            "language",
            "Unknown"
        )

        score = resource.get(
            "hybrid_score",
            resource.get(
                "recommendation_score",
                "N/A"
            )
        )


        print(
            f"{i}. {title}"
        )

        print(
            f"   Topic: {topic}"
        )

        print(
            f"   Level: {level}"
        )

        print(
            f"   Language: {language}"
        )

        print(
            f"   Hybrid Score: {score}"
        )

        print()


    print("-" * 80)


    # --------------------------------------------------------
    # GROQ GENERATION
    # --------------------------------------------------------

    print(
        "\nGenerating RAG response..."
    )

    print(
        f"Using Groq model: {GROQ_MODEL}"
    )

    print()


    answer = generate_response(
        query,
        resources
    )


    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    print("=" * 80)
    print("PLACIFY RECOMMENDATION")
    print("=" * 80)

    print()

    print(answer)

    print()

    print("=" * 80)
    print("4E-F RAG GENERATION COMPLETE")
    print("=" * 80)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()