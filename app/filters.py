import mistune
from app import application
from datetime import datetime, timedelta

@application.template_filter()
def markdownToHtml(text):
    renderer = mistune.Renderer(hard_wrap=True)
    markdown2html = mistune.Markdown(renderer=renderer)
    return markdown2html(text)


@application.template_filter()
def daysToDate(d):
    dt = datetime.now()
    td = timedelta(days=int(d))
    result = dt + td
    print(result)
    return result.strftime("%Y-%m-%d")
