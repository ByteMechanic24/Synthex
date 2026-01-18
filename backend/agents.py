# Heart of the project
# 4 things
# i.Search Agent using create_agent which will use the web_search tool.
# ii.Reader Agent using the same pattern but with web_scraper tool.
# iii. Writer Chain using the modern LCEL pipe syntax - prompt | llm | StrOutputParser() which takes all the research and writes a full report.
# iv. The Critic Chain again using LCEL pipe which reads the report and gives a score and feedback.

from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, web_scraper
from dotenv import load_dotenv
load_dotenv()

llm = ChatMistralAI(model="mistral-small-2506", temperature=0)


# 1st agent
def build_search_agent():
    return create_agent(
        model=llm,
        tools=[web_search]
    )


def build_search_reader_agent():
    return create_agent(
        model=llm,
        tools=[web_scraper]
    )


# writer chain
writer_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert research writer. Write clear, structured and insightful reports."),
    ("human", """Write a detailed research report on the topic below.

Topic: {topic}

Research Gathered:
{research}

Structure the report as:
- Introduction
- Key Findings (minimum 3 well-explained points)
- Conclusion
- Sources (list all URLs found in the research)

Be detailed, factual and professional."""),
])

writer_chain = writer_prompt | llm | StrOutputParser()

# critic chain

critic_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a sharp and constructive research critic. Be honest and specific."),
    ("human", """Review the research report below and evaluate it strictly.

Report:
{report}

Respond in this exact format:

Score: X/10

Strengths:
- ...
- ...

Areas to Improve:
- ...
- ...

One line verdict:
..."""),
])

critic_chain = critic_prompt | llm | StrOutputParser()
