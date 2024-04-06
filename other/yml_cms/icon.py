import urllib.request
import re
import sys
import json
from bs4 import BeautifulSoup as soup

url = 'https://www.irasutoya.com/search?q='

term = sys.argv[1]

term = urllib.parse.quote(term, encoding='utf-8')

try:
    req = urllib.request.Request(
        url+term+"&updated-max=2013-07-22T21:37:00-07:00&max-results=200&start=0&by-date=false", 
        data=None, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
        }
    )

    f = urllib.request.urlopen(req)
    html = f.read().decode('utf-8')
    _soup = soup(html, 'html.parser')
    # results = _soup.find_all('img')
    # results = re.findall('class="boxthumb"(.*)', html)
    print("<iframe href='"+html+"'></iframe>")
except Exception as e:
    print(e)
