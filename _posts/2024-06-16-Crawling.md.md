# Crawling

# Korean monthly rent around Univeristy(Shinchon, Hoegi, Konkuk)


```python
pip install user-agent 
```


```python
from user_agent import generate_user_agent, generate_navigator
user_agent = generate_user_agent() #임의의 user_agent 생성
user_agent #url 넘겨줄 때 이 user_agent 값도 같이 넘겨 줄 예정
```

### needed libraries


```python
import requests
import numpy as np
import pandas as pd
from tqdm.notebook import tqdm
import time 
```

### In chrome library Devtools, Get article request's url in Network


```python
url = 'https://m.land.naver.com/cluster/ajax/articleList?itemId=&mapKey=&lgeo=&showR0=&rletTpCd=OPST%3AVL%3AOR&tradTpCd=B2&z=12&lat=37.481021&lon=126.951601&btm=37.3823307&lft=126.800024&top=37.5795812&rgt=127.103178&totCnt=8758&cortarNo=1162000000&sort=rank&page=2'
user_agent = generate_user_agent() #user_agent 생성, HTTP를 크롤링할 때 user agent라는 일종의 계정이 필요
headers = {'User-Agent':user_agent}#headers 딕셔너리에 user_agent格納

headers
```


```python
res = requests.get(url, headers=headers) # requets.get함수를 통해 url의 정보를 json형태로 가져옴 이때 headers 계정 쓰임
res.json() #이 중 우리가 워하는 데이터는 body안에 들어가있음
```


```python
res.json()['body']
```


```python
body=res.json()['body']
```


```python
article_list = []
article_list.append(body)
```


```python
article_list
```


```python
article_list[0][0] #지금 개별 데이터는 article_list[0][0], article_list[0][1]에 담겨있음
```




    {'atclNo': '2421558413',
     'cortarNo': '1162010200',
     'atclNm': '일반원룸',
     'atclStatCd': 'R0',
     'rletTpCd': 'C01',
     'uprRletTpCd': 'C01',
     'rletTpNm': '원룸',
     'tradTpCd': 'B2',
     'tradTpNm': '월세',
     'vrfcTpCd': 'SITE',
     'flrInfo': '1/3',
     'prc': 500,
     'rentPrc': 56,
     'hanPrc': '500',
     'spc1': '19',
     'spc2': '19.83',
     'direction': '북향',
     'atclCfmYmd': '24.05.03.',
     'repImgUrl': '/20240503_146/land_naver_1714727109797odr7i_JPEG/PM-1.P-eq/f63f9fdaebf323d9ec5ab900cd1a3f33.jpg',
     'repImgTpCd': 'P360',
     'repImgThumb': 'preview1920',
     'lat': 37.481109,
     'lng': 126.924622,
     'atclFetrDesc': '깔끔한 오픈 오픈 원룸',
     'tagList': ['10년이내', '1층', '화장실한개'],
     'bildNm': '',
     'minute': 0,
     'sameAddrCnt': 1,
     'sameAddrDirectCnt': 0,
     'cpid': 'SERVE',
     'cpNm': '부동산써브',
     'cpCnt': 1,
     'rltrNm': '캐치홈공인중개사사무소',
     'directTradYn': 'N',
     'minMviFee': 0,
     'maxMviFee': 0,
     'etRoomCnt': 0,
     'tradePriceHan': '',
     'tradeRentPrice': 0,
     'tradeCheckedByOwner': False,
     'cpLinkVO': {'cpId': 'SERVE',
      'mobileArticleUrl': 'https://www.serve.co.kr/redirect/nland?UID=',
      'mobileArticleLinkTypeCode': 'CPNAMEONLY',
      'mobileBmsInspectPassYn': 'Y',
      'pcArticleLinkUseAtArticleTitle': False,
      'pcArticleLinkUseAtCpName': False,
      'mobileArticleLinkUseAtArticleTitle': False,
      'mobileArticleLinkUseAtCpName': True},
     'dtlAddrYn': 'N',
     'dtlAddr': ''}




```python
article_list1 = [i for i in article_list[0]]
```


```python
article_list1[0] #굳
```


```python
len(article_list1) #한페이지 크롤링 할 때마다 매물 20개씩 올라옴
```

# Shinchon

### There are 20 lists in one url so page1 to 40 ->800 lists


```python
 shinchon = []
for i in tqdm(range(1, 41)): #페이지 넘버를 1부터 41까지 굴림
    try:
        url = f'https://m.land.naver.com/cluster/ajax/articleList?itemId=&mapKey=&lgeo=&showR0=&rletTpCd=OPST%3AVL%3AOR&tradTpCd=B2&z=15&lat=37.5578026&lon=126.9382343&btm=37.5454861&lft=126.9196734&top=37.5701171&rgt=126.9567952&totCnt=1447&cortarNo=&sort=rank&page={i}'

        user_agent = generate_user_agent()
        headers = {'User-Agent':user_agent}

        res = requests.get(url, headers=headers)
        time.sleep(1)

        article_json = res.json()
        article_body = article_json['body']
        shinchon.append(article_body) #위에서 얻은 정보를 리스트에다가 저장
    except: #try-excep문: 페이지 넘버가 100까지 없을 수도 있는데 일단 해라
        break
```


```python
shinchon[0] #shinchon[0][0],shinchon[0][1]...shinchon[1][0],shinchon[1][1]이 데이터들을 shinchon[0], shinchon[1]로 정리해야함
```


```python
shinchon_result=[]
for sublist in shinchon:
    for item in sublist:
        shinchon_result.append(item)
```


```python
Shinchon_DF = pd.DataFrame(shinchon_result)
Shinchon_DF.head(5)
```


```python
pd.set_option('display.max_columns', None) #열 전체보기
Shinchon_DF
```


```python
Shinchon_needed = Shinchon_DF[['atclNo','rletTpNm','flrInfo','rentPrc','hanPrc','spc2','direction','lat','lng']]
#필요한 것들만 뽑아
Shinchon_needed.columns = ['ID','Type','Floor','Monthly','Deposit','Area(m2)','Direction','Latitude','Longitude']
#컬럼들 이름 바꾸기
```


```python
Shinchon_needed.head(5)
```


```python
Shinchon_needed.info() #800개 잘 들어있음
```


```python
Shinchon_needed.to_excel("Shinchon_needed.xlsx", index=False)
```

# Hoegi


```python
 hoegi = []
for i in tqdm(range(1, 41)): #페이지 넘버를 1부터 41까지 굴림
    try:
        url = f'https://m.land.naver.com/cluster/ajax/articleList?itemId=&mapKey=&lgeo=&showR0=&rletTpCd=OPST%3AVL%3AOR&tradTpCd=B2&z=15&lat=37.5906176&lon=127.0559155&btm=37.5783066&lft=127.0373546&top=37.6029267&rgt=127.0744764&totCnt=886&cortarNo=&sort=rank&page={i}'

        user_agent = generate_user_agent()
        headers = {'User-Agent':user_agent}

        res = requests.get(url, headers=headers)
        time.sleep(1)

        article_json = res.json()
        article_body = article_json['body']
        hoegi.append(article_body) #위에서 얻은 정보를 리스트에다가 저장
    except: #try-excep문: 페이지 넘버가 100까지 없을 수도 있는데 일단 해라
        break
```


```python
hoegi[0]
```


```python
hoegi_result=[]
for sublist in hoegi:
    for item in sublist:
        hoegi_result.append(item)
```


```python
hoegi_result[0]
```


```python
Hoegi_DF = pd.DataFrame(hoegi_result)
Hoegi_DF.head(5)
```


```python
Hoegi_needed = Hoegi_DF[['atclNo','rletTpNm','flrInfo','rentPrc','hanPrc','spc2','direction','lat','lng','tagList']]
#필요한 것들만 뽑아
Hoegi_needed.columns = ['ID','Type','Floor','Monthly','Deposit','Area(m2)','Direction','Latitude','Longitude','Etc']
#컬럼들 이름 바꾸기
```


```python
Hoegi_needed.head(5)
```


```python
Hoegi_needed.info() # 800개 잘 들어갔군
```


```python
Hoegi_needed.to_excel("Hoegi_needed.xlsx", index=False)
```

# Konkuk


```python
konkuk = []
for i in tqdm(range(1, 41)): #페이지 넘버를 1부터 41까지 굴림
    try:
        url = f'https://m.land.naver.com/cluster/ajax/articleList?itemId=&mapKey=&lgeo=&showR0=&rletTpCd=OPST%3AVL%3AOR&tradTpCd=B2&z=15&lat=37.543974&lon=127.0739949&btm=37.5316552&lft=127.055434&top=37.5562907&rgt=127.0925558&totCnt=470&cortarNo=&sort=rank&page={i}'

        user_agent = generate_user_agent()
        headers = {'User-Agent':user_agent}

        res = requests.get(url, headers=headers)
        time.sleep(1)

        article_json = res.json()
        article_body = article_json['body']
        konkuk.append(article_body) #위에서 얻은 정보를 리스트에다가 저장
    except: #try-excep문: 페이지 넘버가 100까지 없을 수도 있는데 일단 해라
        break
```


```python
konkuk[0]
```


```python
konkuk_result=[]
for sublist in konkuk:
    for item in sublist:
        konkuk_result.append(item)
```


```python
konkuk_result[0]
```


```python
Konkuk_DF = pd.DataFrame(konkuk_result)
Konkuk_DF.head(5)
```


```python
Konkuk_needed = Konkuk_DF[['atclNo','rletTpNm','flrInfo','rentPrc','hanPrc','spc2','direction','lat','lng','tagList']]
#필요한 것들만 뽑아
Konkuk_needed.columns = ['ID','Type','Floor','Monthly','Deposit','Area(m2)','Direction','Latitude','Longitude', 'Etc']
#컬럼들 이름 바꾸기
```


```python
Konkuk_needed.head(5)
```


```python
Konkuk_needed.info() #데이터는 800개 잘 들어가 있군
```


```python
Konkuk_needed.to_excel("Konkuk_needed.xlsx", index=False)
```

# Japanese montly rent near University (Takadanobaba, Ochanomizu, Meidaimae)


```python
pip install user-agent 
```

    Requirement already satisfied: user-agent in c:\users\cbadjl\anaconda3\lib\site-packages (0.1.10)Note: you may need to restart the kernel to use updated packages.
    
    Requirement already satisfied: six in c:\users\cbadjl\anaconda3\lib\site-packages (from user-agent) (1.16.0)
    


```python
from user_agent import generate_user_agent, generate_navigator
user_agent = generate_user_agent() 
user_agent
```




    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36'




```python
import requests
import numpy as np
import pandas as pd
from tqdm.notebook import tqdm
import time 
```


```python
url = 'https://suumo.jp/jj/JJ903FC020/?UID=smapi343&STMP=1715062928&ATT=70647a4419f194e8240c5dcc529240c83f252520&FORMAT=1&CALLBACK=SUUMO.CALLBACK.FUNCTION&P=4&CNT=20&GAZO=2&PROT=1&SE=040&CINM=01&CINM=02&KUKEIPT1LT=35.66416598204824&KUKEIPT1LG=139.7562110390837&KUKEIPT2LT=35.651979210525454&KUKEIPT2LG=139.74659800197432'
user_agent = generate_user_agent() #user_agent 생성, HTTP를 크롤링할 때 user agent라는 일종의 계정이 필요
headers = {'User-Agent':user_agent}#headers 딕셔너리에 user_agent格納

headers
```




    {'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.3; Trident/6.0)'}




```python
res = requests.get(url, headers=headers) # requets.get함수를 통해 url의 정보를 json형태로 가져옴 이때 headers 계정 쓰임
res.json()
```




    {'smatch': {'condition': '【検索条件】｜表示種別：賃貸｜賃貸間取り：ワンルーム,1K｜並び順：中心緯度経度から近い順｜矩形の点１緯度：35.661度｜矩形の点１経度：139.759度｜矩形の点２緯度：35.649度｜矩形の点２経度：139.75度｜取得画像：全て｜に該当する物件情報をお届けします。',
      'resultset': {'firsthit': 61,
       'hits': 20,
       'item': [{'bukken_cd': '100380073987',
         'bukken_nm': '大門 1K 4階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/987/100380073987/100380073987_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 15,
         'jusho': '東京都港区芝大門',
         'kaiso_disp': '4階/地下1地上10階建',
         'kakaku': '13.8万円',
         'kanrihi': '12000円',
         'kotsu': '都営大江戸線/大門駅 歩3分',
         'lg': 139.753286392348,
         'link': 'https://suumo.jp/chintai/bc_100380073987/',
         'lt': 35.6555964743216,
         'madori': '1K',
         'menseki': '26.35平米',
         'new_update_icon': 1,
         'reikin': '-',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100376197661',
         'bukken_nm': '大門 1K 5階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/661/100376197661/100376197661_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 16,
         'jusho': '東京都港区芝大門',
         'kaiso_disp': '5階/地下2地上10階建',
         'kakaku': '14.4万円',
         'kanrihi': '12000円',
         'kotsu': '都営大江戸線/大門駅 歩3分',
         'lg': 139.753279449186,
         'link': 'https://suumo.jp/chintai/bc_100376197661/',
         'lt': 35.655575920808,
         'madori': '1K',
         'menseki': '30.69平米',
         'new_update_icon': 0,
         'reikin': '-',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100376313665',
         'bukken_nm': 'ハイリーフ芝大門 3階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/665/100376313665/100376313665_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 12,
         'jusho': '東京都港区芝大門',
         'kaiso_disp': '3階/地下1地上10階建',
         'kakaku': '14.2万円',
         'kanrihi': '12000円',
         'kotsu': '都営大江戸線/大門駅 歩4分',
         'lg': 139.753286392348,
         'link': 'https://suumo.jp/chintai/bc_100376313665/',
         'lt': 35.6555964743216,
         'madori': '1K',
         'menseki': '31.62平米',
         'new_update_icon': 0,
         'reikin': '-',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100355102748',
         'bukken_nm': '浜松町 1K 4階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/748/100355102748/100355102748_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '23年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区芝大門',
         'kaiso_disp': '4階/13階建',
         'kakaku': '9.5万円',
         'kanrihi': '12000円',
         'kotsu': 'ＪＲ山手線/浜松町駅 歩10分',
         'lg': 139.754289218616,
         'link': 'https://suumo.jp/chintai/bc_100355102748/',
         'lt': 35.6598774262011,
         'madori': '1K',
         'menseki': '24平米',
         'new_update_icon': 0,
         'reikin': '9.5万円',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100304323310',
         'bukken_nm': '芝ダイヤハイツ 7階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/310/100304323310/100304323310_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '45年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区芝大門',
         'kaiso_disp': '7階/11階建',
         'kakaku': '8万円',
         'kanrihi': '5000円',
         'kotsu': '都営浅草線/大門駅 歩1分',
         'lg': 139.754361277479,
         'link': 'https://suumo.jp/chintai/bc_100304323310/',
         'lt': 35.6562978154398,
         'madori': 'ワンルーム',
         'menseki': '17.81平米',
         'new_update_icon': 0,
         'reikin': '-',
         'shikikin': '20万円',
         'shubetsu': '040'},
        {'bukken_cd': '100377516036',
         'bukken_nm': 'エクセリア芝大門 6階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/036/100377516036/100377516036_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '24年',
         'juko_nayose_cnt': 10,
         'jusho': '東京都港区芝公園',
         'kaiso_disp': '6階/7階建',
         'kakaku': '8万円',
         'kanrihi': '10000円',
         'kotsu': 'ＪＲ山手線/浜松町駅 歩7分',
         'lg': 139.75147739801,
         'link': 'https://suumo.jp/chintai/bc_100377516036/',
         'lt': 35.6550395427704,
         'madori': '1K',
         'menseki': '19.57平米',
         'new_update_icon': 0,
         'reikin': '8万円',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100378066958',
         'bukken_nm': '浜松町 1K 6階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/958/100378066958/100378066958_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '24年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区芝公園',
         'kaiso_disp': '6階/7階建',
         'kakaku': '8万円',
         'kanrihi': '10000円',
         'kotsu': 'ＪＲ山手線/浜松町駅 歩7分',
         'lg': 139.75147739801,
         'link': 'https://suumo.jp/chintai/bc_100378066958/',
         'lt': 35.6550395427704,
         'madori': '1K',
         'menseki': '19.57平米',
         'new_update_icon': 0,
         'reikin': '8万円',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100377498880',
         'bukken_nm': '大門 1K 2階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/880/100377498880/100377498880_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '10年',
         'juko_nayose_cnt': 13,
         'jusho': '東京都港区芝大門',
         'kaiso_disp': '2階/15階建',
         'kakaku': '12.3万円',
         'kanrihi': '5000円',
         'kotsu': '都営大江戸線/大門駅 歩3分',
         'lg': 139.753743307271,
         'link': 'https://suumo.jp/chintai/bc_100377498880/',
         'lt': 35.6553212382784,
         'madori': '1K',
         'menseki': '25.86平米',
         'new_update_icon': 0,
         'reikin': '24.6万円(12.3万円)',
         'shikikin': '12.3万円',
         'shubetsu': '040'},
        {'bukken_cd': '100377211621',
         'bukken_nm': '大門 1K 2階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/621/100377211621/100377211621_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '10年',
         'juko_nayose_cnt': 2,
         'jusho': '東京都港区芝大門',
         'kaiso_disp': '2階/15階建',
         'kakaku': '13.9万円',
         'kanrihi': '5000円',
         'kotsu': '都営大江戸線/大門駅 歩3分',
         'lg': 139.753733308522,
         'link': 'https://suumo.jp/chintai/bc_100377211621/',
         'lt': 35.6553092948645,
         'madori': '1K',
         'menseki': '25.86平米',
         'new_update_icon': 0,
         'reikin': '27.8万円',
         'shikikin': '13.9万円',
         'shubetsu': '040'},
        {'bukken_cd': '100375937539',
         'bukken_nm': 'ルーブル芝公園 4階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/539/100375937539/100375937539_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '23年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区芝公園',
         'kaiso_disp': '4階/8階建',
         'kakaku': '8万円',
         'kanrihi': '9000円',
         'kotsu': '都営三田線/芝公園駅 歩3分',
         'lg': 139.752004866586,
         'link': 'https://suumo.jp/chintai/bc_100375937539/',
         'lt': 35.6546429328061,
         'madori': '1K',
         'menseki': '19.34平米',
         'new_update_icon': 0,
         'reikin': '8万円(8万円)',
         'shikikin': '8万円',
         'shubetsu': '040'},
        {'bukken_cd': '100377645951',
         'bukken_nm': '芝公園 1K 6階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/951/100377645951/100377645951_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '24年',
         'juko_nayose_cnt': 3,
         'jusho': '東京都港区芝公園',
         'kaiso_disp': '6階/7階建',
         'kakaku': '8万円',
         'kanrihi': '10000円',
         'kotsu': '都営三田線/芝公園駅 歩3分',
         'lg': 139.751843493932,
         'link': 'https://suumo.jp/chintai/bc_100377645951/',
         'lt': 35.6545676589425,
         'madori': '1K',
         'menseki': '19.57平米',
         'new_update_icon': 0,
         'reikin': '8万円',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100377361880',
         'bukken_nm': 'エクセリア芝大門 6階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/880/100377361880/100377361880_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '24年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区芝公園',
         'kaiso_disp': '6階/7階建',
         'kakaku': '8.4万円',
         'kanrihi': '8000円',
         'kotsu': '都営三田線/芝公園駅 歩3分',
         'lg': 139.751843493932,
         'link': 'https://suumo.jp/chintai/bc_100377361880/',
         'lt': 35.6545676589425,
         'madori': '1K',
         'menseki': '18.76平米',
         'new_update_icon': 0,
         'reikin': '8.4万円',
         'shikikin': '8.4万円',
         'shubetsu': '040'},
        {'bukken_cd': '100374381498',
         'bukken_nm': 'パレステュディオ浜松町 1階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/498/100374381498/100374381498_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 5,
         'jusho': '東京都港区浜松町',
         'kaiso_disp': '1階/10階建',
         'kakaku': '9.1万円',
         'kanrihi': '12000円',
         'kotsu': '都営大江戸線/大門駅 歩4分',
         'lg': 139.7558346753,
         'link': 'https://suumo.jp/chintai/bc_100374381498/',
         'lt': 35.6589172926198,
         'madori': '1K',
         'menseki': '25.4平米',
         'new_update_icon': 0,
         'reikin': '-(9.1万円)',
         'shikikin': '9.1万円',
         'shubetsu': '040'},
        {'bukken_cd': '100374381203',
         'bukken_nm': '大門 1K 1階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/203/100374381203/100374381203_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 3,
         'jusho': '東京都港区浜松町',
         'kaiso_disp': '1階/10階建',
         'kakaku': '9.1万円',
         'kanrihi': '12000円',
         'kotsu': '都営大江戸線/大門駅 歩4分',
         'lg': 139.7558346753,
         'link': 'https://suumo.jp/chintai/bc_100374381203/',
         'lt': 35.6589172926198,
         'madori': '1K',
         'menseki': '25.4平米',
         'new_update_icon': 0,
         'reikin': '-(9.1万円)',
         'shikikin': '9.1万円',
         'shubetsu': '040'},
        {'bukken_cd': '100374371281',
         'bukken_nm': 'パレステュディオ浜松町 1階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/281/100374371281/100374371281_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 11,
         'jusho': '東京都港区浜松町',
         'kaiso_disp': '1階/10階建',
         'kakaku': '9.4万円',
         'kanrihi': '12000円',
         'kotsu': 'ＪＲ山手線/浜松町駅 歩6分',
         'lg': 139.7558346753,
         'link': 'https://suumo.jp/chintai/bc_100374371281/',
         'lt': 35.6589172926198,
         'madori': '1K',
         'menseki': '25.4平米',
         'new_update_icon': 1,
         'reikin': '-(9.4万円)',
         'shikikin': '9.4万円',
         'shubetsu': '040'},
        {'bukken_cd': '100374606283',
         'bukken_nm': '大門 1K 1階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/283/100374606283/100374606283_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 4,
         'jusho': '東京都港区浜松町',
         'kaiso_disp': '1階/10階建',
         'kakaku': '9.4万円',
         'kanrihi': '12000円',
         'kotsu': '都営浅草線/大門駅 歩4分',
         'lg': 139.755809399266,
         'link': 'https://suumo.jp/chintai/bc_100374606283/',
         'lt': 35.6589292351124,
         'madori': '1K',
         'menseki': '25.4平米',
         'new_update_icon': 0,
         'reikin': '-(9.4万円)',
         'shikikin': '9.4万円',
         'shubetsu': '040'},
        {'bukken_cd': '100370487891',
         'bukken_nm': 'パレステュディオ浜松町 1階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/891/100370487891/100370487891_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区浜松町',
         'kaiso_disp': '1階/10階建',
         'kakaku': '8万円',
         'kanrihi': '9000円',
         'kotsu': 'ＪＲ山手線/浜松町駅 歩6分',
         'lg': 139.7558346753,
         'link': 'https://suumo.jp/chintai/bc_100370487891/',
         'lt': 35.6589172926198,
         'madori': '1K',
         'menseki': '19.73平米',
         'new_update_icon': 0,
         'reikin': '8万円(8万円)',
         'shikikin': '8万円',
         'shubetsu': '040'},
        {'bukken_cd': '100373664556',
         'bukken_nm': 'コンシェリア新橋 SIX 10階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/556/100373664556/100373664556_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '8年',
         'juko_nayose_cnt': 4,
         'jusho': '東京都港区新橋',
         'kaiso_disp': '10階/15階建',
         'kakaku': '10.6万円',
         'kanrihi': '15000円',
         'kotsu': '都営三田線/御成門駅 歩4分',
         'lg': 139.754712209268,
         'link': 'https://suumo.jp/chintai/bc_100373664556/',
         'lt': 35.6607384551484,
         'madori': '1K',
         'menseki': '22.07平米',
         'new_update_icon': 0,
         'reikin': '10.6万円',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100374712876',
         'bukken_nm': 'コンシェリア新橋SIX 10階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/876/100374712876/100374712876_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '8年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区新橋',
         'kaiso_disp': '10階/15階建',
         'kakaku': '10.6万円',
         'kanrihi': '15000円',
         'kotsu': '都営三田線/御成門駅 歩4分',
         'lg': 139.75469915742,
         'link': 'https://suumo.jp/chintai/bc_100374712876/',
         'lt': 35.6606612409428,
         'madori': '1K',
         'menseki': '22.07平米',
         'new_update_icon': 0,
         'reikin': '10.6万円',
         'shikikin': '-',
         'shubetsu': '040'},
        {'bukken_cd': '100373417891',
         'bukken_nm': 'アルテリア浜松町 8階',
         'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/891/100373417891/100373417891_gw.jpg',
         'category': '賃貸',
         'chikugonensu': '22年',
         'juko_nayose_cnt': 1,
         'jusho': '東京都港区浜松町',
         'kaiso_disp': '8階/9階建',
         'kakaku': '11万円',
         'kanrihi': '10000円',
         'kotsu': '都営浅草線/大門駅 歩5分',
         'lg': 139.75593800464,
         'link': 'https://suumo.jp/chintai/bc_100373417891/',
         'lt': 35.6587753662341,
         'madori': '1K',
         'menseki': '23.5平米',
         'new_update_icon': 0,
         'reikin': '11万円',
         'shikikin': '-',
         'shubetsu': '040'}],
       'lasthit': 80,
       'totalhits': 299},
      'warnings': {}}}




```python
res.json()['smatch']['resultset']['item']
```




    [{'bukken_cd': '100380073987',
      'bukken_nm': '大門 1K 4階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/987/100380073987/100380073987_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 15,
      'jusho': '東京都港区芝大門',
      'kaiso_disp': '4階/地下1地上10階建',
      'kakaku': '13.8万円',
      'kanrihi': '12000円',
      'kotsu': '都営大江戸線/大門駅 歩3分',
      'lg': 139.753286392348,
      'link': 'https://suumo.jp/chintai/bc_100380073987/',
      'lt': 35.6555964743216,
      'madori': '1K',
      'menseki': '26.35平米',
      'new_update_icon': 1,
      'reikin': '-',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100376197661',
      'bukken_nm': '大門 1K 5階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/661/100376197661/100376197661_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 16,
      'jusho': '東京都港区芝大門',
      'kaiso_disp': '5階/地下2地上10階建',
      'kakaku': '14.4万円',
      'kanrihi': '12000円',
      'kotsu': '都営大江戸線/大門駅 歩3分',
      'lg': 139.753279449186,
      'link': 'https://suumo.jp/chintai/bc_100376197661/',
      'lt': 35.655575920808,
      'madori': '1K',
      'menseki': '30.69平米',
      'new_update_icon': 0,
      'reikin': '-',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100376313665',
      'bukken_nm': 'ハイリーフ芝大門 3階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/665/100376313665/100376313665_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 12,
      'jusho': '東京都港区芝大門',
      'kaiso_disp': '3階/地下1地上10階建',
      'kakaku': '14.2万円',
      'kanrihi': '12000円',
      'kotsu': '都営大江戸線/大門駅 歩4分',
      'lg': 139.753286392348,
      'link': 'https://suumo.jp/chintai/bc_100376313665/',
      'lt': 35.6555964743216,
      'madori': '1K',
      'menseki': '31.62平米',
      'new_update_icon': 0,
      'reikin': '-',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100355102748',
      'bukken_nm': '浜松町 1K 4階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/748/100355102748/100355102748_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '23年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区芝大門',
      'kaiso_disp': '4階/13階建',
      'kakaku': '9.5万円',
      'kanrihi': '12000円',
      'kotsu': 'ＪＲ山手線/浜松町駅 歩10分',
      'lg': 139.754289218616,
      'link': 'https://suumo.jp/chintai/bc_100355102748/',
      'lt': 35.6598774262011,
      'madori': '1K',
      'menseki': '24平米',
      'new_update_icon': 0,
      'reikin': '9.5万円',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100304323310',
      'bukken_nm': '芝ダイヤハイツ 7階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/310/100304323310/100304323310_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '45年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区芝大門',
      'kaiso_disp': '7階/11階建',
      'kakaku': '8万円',
      'kanrihi': '5000円',
      'kotsu': '都営浅草線/大門駅 歩1分',
      'lg': 139.754361277479,
      'link': 'https://suumo.jp/chintai/bc_100304323310/',
      'lt': 35.6562978154398,
      'madori': 'ワンルーム',
      'menseki': '17.81平米',
      'new_update_icon': 0,
      'reikin': '-',
      'shikikin': '20万円',
      'shubetsu': '040'},
     {'bukken_cd': '100377516036',
      'bukken_nm': 'エクセリア芝大門 6階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/036/100377516036/100377516036_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '24年',
      'juko_nayose_cnt': 10,
      'jusho': '東京都港区芝公園',
      'kaiso_disp': '6階/7階建',
      'kakaku': '8万円',
      'kanrihi': '10000円',
      'kotsu': 'ＪＲ山手線/浜松町駅 歩7分',
      'lg': 139.75147739801,
      'link': 'https://suumo.jp/chintai/bc_100377516036/',
      'lt': 35.6550395427704,
      'madori': '1K',
      'menseki': '19.57平米',
      'new_update_icon': 0,
      'reikin': '8万円',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100378066958',
      'bukken_nm': '浜松町 1K 6階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/958/100378066958/100378066958_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '24年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区芝公園',
      'kaiso_disp': '6階/7階建',
      'kakaku': '8万円',
      'kanrihi': '10000円',
      'kotsu': 'ＪＲ山手線/浜松町駅 歩7分',
      'lg': 139.75147739801,
      'link': 'https://suumo.jp/chintai/bc_100378066958/',
      'lt': 35.6550395427704,
      'madori': '1K',
      'menseki': '19.57平米',
      'new_update_icon': 0,
      'reikin': '8万円',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100377498880',
      'bukken_nm': '大門 1K 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/880/100377498880/100377498880_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '10年',
      'juko_nayose_cnt': 13,
      'jusho': '東京都港区芝大門',
      'kaiso_disp': '2階/15階建',
      'kakaku': '12.3万円',
      'kanrihi': '5000円',
      'kotsu': '都営大江戸線/大門駅 歩3分',
      'lg': 139.753743307271,
      'link': 'https://suumo.jp/chintai/bc_100377498880/',
      'lt': 35.6553212382784,
      'madori': '1K',
      'menseki': '25.86平米',
      'new_update_icon': 0,
      'reikin': '24.6万円(12.3万円)',
      'shikikin': '12.3万円',
      'shubetsu': '040'},
     {'bukken_cd': '100377211621',
      'bukken_nm': '大門 1K 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/621/100377211621/100377211621_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '10年',
      'juko_nayose_cnt': 2,
      'jusho': '東京都港区芝大門',
      'kaiso_disp': '2階/15階建',
      'kakaku': '13.9万円',
      'kanrihi': '5000円',
      'kotsu': '都営大江戸線/大門駅 歩3分',
      'lg': 139.753733308522,
      'link': 'https://suumo.jp/chintai/bc_100377211621/',
      'lt': 35.6553092948645,
      'madori': '1K',
      'menseki': '25.86平米',
      'new_update_icon': 0,
      'reikin': '27.8万円',
      'shikikin': '13.9万円',
      'shubetsu': '040'},
     {'bukken_cd': '100375937539',
      'bukken_nm': 'ルーブル芝公園 4階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/539/100375937539/100375937539_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '23年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区芝公園',
      'kaiso_disp': '4階/8階建',
      'kakaku': '8万円',
      'kanrihi': '9000円',
      'kotsu': '都営三田線/芝公園駅 歩3分',
      'lg': 139.752004866586,
      'link': 'https://suumo.jp/chintai/bc_100375937539/',
      'lt': 35.6546429328061,
      'madori': '1K',
      'menseki': '19.34平米',
      'new_update_icon': 0,
      'reikin': '8万円(8万円)',
      'shikikin': '8万円',
      'shubetsu': '040'},
     {'bukken_cd': '100377645951',
      'bukken_nm': '芝公園 1K 6階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/951/100377645951/100377645951_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '24年',
      'juko_nayose_cnt': 3,
      'jusho': '東京都港区芝公園',
      'kaiso_disp': '6階/7階建',
      'kakaku': '8万円',
      'kanrihi': '10000円',
      'kotsu': '都営三田線/芝公園駅 歩3分',
      'lg': 139.751843493932,
      'link': 'https://suumo.jp/chintai/bc_100377645951/',
      'lt': 35.6545676589425,
      'madori': '1K',
      'menseki': '19.57平米',
      'new_update_icon': 0,
      'reikin': '8万円',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100377361880',
      'bukken_nm': 'エクセリア芝大門 6階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/880/100377361880/100377361880_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '24年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区芝公園',
      'kaiso_disp': '6階/7階建',
      'kakaku': '8.4万円',
      'kanrihi': '8000円',
      'kotsu': '都営三田線/芝公園駅 歩3分',
      'lg': 139.751843493932,
      'link': 'https://suumo.jp/chintai/bc_100377361880/',
      'lt': 35.6545676589425,
      'madori': '1K',
      'menseki': '18.76平米',
      'new_update_icon': 0,
      'reikin': '8.4万円',
      'shikikin': '8.4万円',
      'shubetsu': '040'},
     {'bukken_cd': '100374381498',
      'bukken_nm': 'パレステュディオ浜松町 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/498/100374381498/100374381498_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 5,
      'jusho': '東京都港区浜松町',
      'kaiso_disp': '1階/10階建',
      'kakaku': '9.1万円',
      'kanrihi': '12000円',
      'kotsu': '都営大江戸線/大門駅 歩4分',
      'lg': 139.7558346753,
      'link': 'https://suumo.jp/chintai/bc_100374381498/',
      'lt': 35.6589172926198,
      'madori': '1K',
      'menseki': '25.4平米',
      'new_update_icon': 0,
      'reikin': '-(9.1万円)',
      'shikikin': '9.1万円',
      'shubetsu': '040'},
     {'bukken_cd': '100374381203',
      'bukken_nm': '大門 1K 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/203/100374381203/100374381203_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 3,
      'jusho': '東京都港区浜松町',
      'kaiso_disp': '1階/10階建',
      'kakaku': '9.1万円',
      'kanrihi': '12000円',
      'kotsu': '都営大江戸線/大門駅 歩4分',
      'lg': 139.7558346753,
      'link': 'https://suumo.jp/chintai/bc_100374381203/',
      'lt': 35.6589172926198,
      'madori': '1K',
      'menseki': '25.4平米',
      'new_update_icon': 0,
      'reikin': '-(9.1万円)',
      'shikikin': '9.1万円',
      'shubetsu': '040'},
     {'bukken_cd': '100374371281',
      'bukken_nm': 'パレステュディオ浜松町 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/281/100374371281/100374371281_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 11,
      'jusho': '東京都港区浜松町',
      'kaiso_disp': '1階/10階建',
      'kakaku': '9.4万円',
      'kanrihi': '12000円',
      'kotsu': 'ＪＲ山手線/浜松町駅 歩6分',
      'lg': 139.7558346753,
      'link': 'https://suumo.jp/chintai/bc_100374371281/',
      'lt': 35.6589172926198,
      'madori': '1K',
      'menseki': '25.4平米',
      'new_update_icon': 1,
      'reikin': '-(9.4万円)',
      'shikikin': '9.4万円',
      'shubetsu': '040'},
     {'bukken_cd': '100374606283',
      'bukken_nm': '大門 1K 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/283/100374606283/100374606283_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 4,
      'jusho': '東京都港区浜松町',
      'kaiso_disp': '1階/10階建',
      'kakaku': '9.4万円',
      'kanrihi': '12000円',
      'kotsu': '都営浅草線/大門駅 歩4分',
      'lg': 139.755809399266,
      'link': 'https://suumo.jp/chintai/bc_100374606283/',
      'lt': 35.6589292351124,
      'madori': '1K',
      'menseki': '25.4平米',
      'new_update_icon': 0,
      'reikin': '-(9.4万円)',
      'shikikin': '9.4万円',
      'shubetsu': '040'},
     {'bukken_cd': '100370487891',
      'bukken_nm': 'パレステュディオ浜松町 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/891/100370487891/100370487891_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区浜松町',
      'kaiso_disp': '1階/10階建',
      'kakaku': '8万円',
      'kanrihi': '9000円',
      'kotsu': 'ＪＲ山手線/浜松町駅 歩6分',
      'lg': 139.7558346753,
      'link': 'https://suumo.jp/chintai/bc_100370487891/',
      'lt': 35.6589172926198,
      'madori': '1K',
      'menseki': '19.73平米',
      'new_update_icon': 0,
      'reikin': '8万円(8万円)',
      'shikikin': '8万円',
      'shubetsu': '040'},
     {'bukken_cd': '100373664556',
      'bukken_nm': 'コンシェリア新橋 SIX 10階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/556/100373664556/100373664556_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '8年',
      'juko_nayose_cnt': 4,
      'jusho': '東京都港区新橋',
      'kaiso_disp': '10階/15階建',
      'kakaku': '10.6万円',
      'kanrihi': '15000円',
      'kotsu': '都営三田線/御成門駅 歩4分',
      'lg': 139.754712209268,
      'link': 'https://suumo.jp/chintai/bc_100373664556/',
      'lt': 35.6607384551484,
      'madori': '1K',
      'menseki': '22.07平米',
      'new_update_icon': 0,
      'reikin': '10.6万円',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100374712876',
      'bukken_nm': 'コンシェリア新橋SIX 10階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/876/100374712876/100374712876_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '8年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区新橋',
      'kaiso_disp': '10階/15階建',
      'kakaku': '10.6万円',
      'kanrihi': '15000円',
      'kotsu': '都営三田線/御成門駅 歩4分',
      'lg': 139.75469915742,
      'link': 'https://suumo.jp/chintai/bc_100374712876/',
      'lt': 35.6606612409428,
      'madori': '1K',
      'menseki': '22.07平米',
      'new_update_icon': 0,
      'reikin': '10.6万円',
      'shikikin': '-',
      'shubetsu': '040'},
     {'bukken_cd': '100373417891',
      'bukken_nm': 'アルテリア浜松町 8階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/891/100373417891/100373417891_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '22年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都港区浜松町',
      'kaiso_disp': '8階/9階建',
      'kakaku': '11万円',
      'kanrihi': '10000円',
      'kotsu': '都営浅草線/大門駅 歩5分',
      'lg': 139.75593800464,
      'link': 'https://suumo.jp/chintai/bc_100373417891/',
      'lt': 35.6587753662341,
      'madori': '1K',
      'menseki': '23.5平米',
      'new_update_icon': 0,
      'reikin': '11万円',
      'shikikin': '-',
      'shubetsu': '040'}]




```python
body = res.json()['smatch']['resultset']['item']
```


```python
article_list = []
article_list.append(body)
```


```python
article_list
```




    [[{'bukken_cd': '100380073987',
       'bukken_nm': '大門 1K 4階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/987/100380073987/100380073987_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 15,
       'jusho': '東京都港区芝大門',
       'kaiso_disp': '4階/地下1地上10階建',
       'kakaku': '13.8万円',
       'kanrihi': '12000円',
       'kotsu': '都営大江戸線/大門駅 歩3分',
       'lg': 139.753286392348,
       'link': 'https://suumo.jp/chintai/bc_100380073987/',
       'lt': 35.6555964743216,
       'madori': '1K',
       'menseki': '26.35平米',
       'new_update_icon': 1,
       'reikin': '-',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100376197661',
       'bukken_nm': '大門 1K 5階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/661/100376197661/100376197661_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 16,
       'jusho': '東京都港区芝大門',
       'kaiso_disp': '5階/地下2地上10階建',
       'kakaku': '14.4万円',
       'kanrihi': '12000円',
       'kotsu': '都営大江戸線/大門駅 歩3分',
       'lg': 139.753279449186,
       'link': 'https://suumo.jp/chintai/bc_100376197661/',
       'lt': 35.655575920808,
       'madori': '1K',
       'menseki': '30.69平米',
       'new_update_icon': 0,
       'reikin': '-',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100376313665',
       'bukken_nm': 'ハイリーフ芝大門 3階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/665/100376313665/100376313665_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 12,
       'jusho': '東京都港区芝大門',
       'kaiso_disp': '3階/地下1地上10階建',
       'kakaku': '14.2万円',
       'kanrihi': '12000円',
       'kotsu': '都営大江戸線/大門駅 歩4分',
       'lg': 139.753286392348,
       'link': 'https://suumo.jp/chintai/bc_100376313665/',
       'lt': 35.6555964743216,
       'madori': '1K',
       'menseki': '31.62平米',
       'new_update_icon': 0,
       'reikin': '-',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100355102748',
       'bukken_nm': '浜松町 1K 4階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/748/100355102748/100355102748_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '23年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区芝大門',
       'kaiso_disp': '4階/13階建',
       'kakaku': '9.5万円',
       'kanrihi': '12000円',
       'kotsu': 'ＪＲ山手線/浜松町駅 歩10分',
       'lg': 139.754289218616,
       'link': 'https://suumo.jp/chintai/bc_100355102748/',
       'lt': 35.6598774262011,
       'madori': '1K',
       'menseki': '24平米',
       'new_update_icon': 0,
       'reikin': '9.5万円',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100304323310',
       'bukken_nm': '芝ダイヤハイツ 7階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/310/100304323310/100304323310_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '45年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区芝大門',
       'kaiso_disp': '7階/11階建',
       'kakaku': '8万円',
       'kanrihi': '5000円',
       'kotsu': '都営浅草線/大門駅 歩1分',
       'lg': 139.754361277479,
       'link': 'https://suumo.jp/chintai/bc_100304323310/',
       'lt': 35.6562978154398,
       'madori': 'ワンルーム',
       'menseki': '17.81平米',
       'new_update_icon': 0,
       'reikin': '-',
       'shikikin': '20万円',
       'shubetsu': '040'},
      {'bukken_cd': '100377516036',
       'bukken_nm': 'エクセリア芝大門 6階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/036/100377516036/100377516036_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '24年',
       'juko_nayose_cnt': 10,
       'jusho': '東京都港区芝公園',
       'kaiso_disp': '6階/7階建',
       'kakaku': '8万円',
       'kanrihi': '10000円',
       'kotsu': 'ＪＲ山手線/浜松町駅 歩7分',
       'lg': 139.75147739801,
       'link': 'https://suumo.jp/chintai/bc_100377516036/',
       'lt': 35.6550395427704,
       'madori': '1K',
       'menseki': '19.57平米',
       'new_update_icon': 0,
       'reikin': '8万円',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100378066958',
       'bukken_nm': '浜松町 1K 6階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/958/100378066958/100378066958_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '24年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区芝公園',
       'kaiso_disp': '6階/7階建',
       'kakaku': '8万円',
       'kanrihi': '10000円',
       'kotsu': 'ＪＲ山手線/浜松町駅 歩7分',
       'lg': 139.75147739801,
       'link': 'https://suumo.jp/chintai/bc_100378066958/',
       'lt': 35.6550395427704,
       'madori': '1K',
       'menseki': '19.57平米',
       'new_update_icon': 0,
       'reikin': '8万円',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100377498880',
       'bukken_nm': '大門 1K 2階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/880/100377498880/100377498880_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '10年',
       'juko_nayose_cnt': 13,
       'jusho': '東京都港区芝大門',
       'kaiso_disp': '2階/15階建',
       'kakaku': '12.3万円',
       'kanrihi': '5000円',
       'kotsu': '都営大江戸線/大門駅 歩3分',
       'lg': 139.753743307271,
       'link': 'https://suumo.jp/chintai/bc_100377498880/',
       'lt': 35.6553212382784,
       'madori': '1K',
       'menseki': '25.86平米',
       'new_update_icon': 0,
       'reikin': '24.6万円(12.3万円)',
       'shikikin': '12.3万円',
       'shubetsu': '040'},
      {'bukken_cd': '100377211621',
       'bukken_nm': '大門 1K 2階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/621/100377211621/100377211621_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '10年',
       'juko_nayose_cnt': 2,
       'jusho': '東京都港区芝大門',
       'kaiso_disp': '2階/15階建',
       'kakaku': '13.9万円',
       'kanrihi': '5000円',
       'kotsu': '都営大江戸線/大門駅 歩3分',
       'lg': 139.753733308522,
       'link': 'https://suumo.jp/chintai/bc_100377211621/',
       'lt': 35.6553092948645,
       'madori': '1K',
       'menseki': '25.86平米',
       'new_update_icon': 0,
       'reikin': '27.8万円',
       'shikikin': '13.9万円',
       'shubetsu': '040'},
      {'bukken_cd': '100375937539',
       'bukken_nm': 'ルーブル芝公園 4階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/539/100375937539/100375937539_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '23年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区芝公園',
       'kaiso_disp': '4階/8階建',
       'kakaku': '8万円',
       'kanrihi': '9000円',
       'kotsu': '都営三田線/芝公園駅 歩3分',
       'lg': 139.752004866586,
       'link': 'https://suumo.jp/chintai/bc_100375937539/',
       'lt': 35.6546429328061,
       'madori': '1K',
       'menseki': '19.34平米',
       'new_update_icon': 0,
       'reikin': '8万円(8万円)',
       'shikikin': '8万円',
       'shubetsu': '040'},
      {'bukken_cd': '100377645951',
       'bukken_nm': '芝公園 1K 6階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/951/100377645951/100377645951_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '24年',
       'juko_nayose_cnt': 3,
       'jusho': '東京都港区芝公園',
       'kaiso_disp': '6階/7階建',
       'kakaku': '8万円',
       'kanrihi': '10000円',
       'kotsu': '都営三田線/芝公園駅 歩3分',
       'lg': 139.751843493932,
       'link': 'https://suumo.jp/chintai/bc_100377645951/',
       'lt': 35.6545676589425,
       'madori': '1K',
       'menseki': '19.57平米',
       'new_update_icon': 0,
       'reikin': '8万円',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100377361880',
       'bukken_nm': 'エクセリア芝大門 6階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/880/100377361880/100377361880_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '24年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区芝公園',
       'kaiso_disp': '6階/7階建',
       'kakaku': '8.4万円',
       'kanrihi': '8000円',
       'kotsu': '都営三田線/芝公園駅 歩3分',
       'lg': 139.751843493932,
       'link': 'https://suumo.jp/chintai/bc_100377361880/',
       'lt': 35.6545676589425,
       'madori': '1K',
       'menseki': '18.76平米',
       'new_update_icon': 0,
       'reikin': '8.4万円',
       'shikikin': '8.4万円',
       'shubetsu': '040'},
      {'bukken_cd': '100374381498',
       'bukken_nm': 'パレステュディオ浜松町 1階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/498/100374381498/100374381498_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 5,
       'jusho': '東京都港区浜松町',
       'kaiso_disp': '1階/10階建',
       'kakaku': '9.1万円',
       'kanrihi': '12000円',
       'kotsu': '都営大江戸線/大門駅 歩4分',
       'lg': 139.7558346753,
       'link': 'https://suumo.jp/chintai/bc_100374381498/',
       'lt': 35.6589172926198,
       'madori': '1K',
       'menseki': '25.4平米',
       'new_update_icon': 0,
       'reikin': '-(9.1万円)',
       'shikikin': '9.1万円',
       'shubetsu': '040'},
      {'bukken_cd': '100374381203',
       'bukken_nm': '大門 1K 1階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/203/100374381203/100374381203_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 3,
       'jusho': '東京都港区浜松町',
       'kaiso_disp': '1階/10階建',
       'kakaku': '9.1万円',
       'kanrihi': '12000円',
       'kotsu': '都営大江戸線/大門駅 歩4分',
       'lg': 139.7558346753,
       'link': 'https://suumo.jp/chintai/bc_100374381203/',
       'lt': 35.6589172926198,
       'madori': '1K',
       'menseki': '25.4平米',
       'new_update_icon': 0,
       'reikin': '-(9.1万円)',
       'shikikin': '9.1万円',
       'shubetsu': '040'},
      {'bukken_cd': '100374371281',
       'bukken_nm': 'パレステュディオ浜松町 1階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/281/100374371281/100374371281_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 11,
       'jusho': '東京都港区浜松町',
       'kaiso_disp': '1階/10階建',
       'kakaku': '9.4万円',
       'kanrihi': '12000円',
       'kotsu': 'ＪＲ山手線/浜松町駅 歩6分',
       'lg': 139.7558346753,
       'link': 'https://suumo.jp/chintai/bc_100374371281/',
       'lt': 35.6589172926198,
       'madori': '1K',
       'menseki': '25.4平米',
       'new_update_icon': 1,
       'reikin': '-(9.4万円)',
       'shikikin': '9.4万円',
       'shubetsu': '040'},
      {'bukken_cd': '100374606283',
       'bukken_nm': '大門 1K 1階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/283/100374606283/100374606283_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 4,
       'jusho': '東京都港区浜松町',
       'kaiso_disp': '1階/10階建',
       'kakaku': '9.4万円',
       'kanrihi': '12000円',
       'kotsu': '都営浅草線/大門駅 歩4分',
       'lg': 139.755809399266,
       'link': 'https://suumo.jp/chintai/bc_100374606283/',
       'lt': 35.6589292351124,
       'madori': '1K',
       'menseki': '25.4平米',
       'new_update_icon': 0,
       'reikin': '-(9.4万円)',
       'shikikin': '9.4万円',
       'shubetsu': '040'},
      {'bukken_cd': '100370487891',
       'bukken_nm': 'パレステュディオ浜松町 1階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/891/100370487891/100370487891_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区浜松町',
       'kaiso_disp': '1階/10階建',
       'kakaku': '8万円',
       'kanrihi': '9000円',
       'kotsu': 'ＪＲ山手線/浜松町駅 歩6分',
       'lg': 139.7558346753,
       'link': 'https://suumo.jp/chintai/bc_100370487891/',
       'lt': 35.6589172926198,
       'madori': '1K',
       'menseki': '19.73平米',
       'new_update_icon': 0,
       'reikin': '8万円(8万円)',
       'shikikin': '8万円',
       'shubetsu': '040'},
      {'bukken_cd': '100373664556',
       'bukken_nm': 'コンシェリア新橋 SIX 10階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/556/100373664556/100373664556_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '8年',
       'juko_nayose_cnt': 4,
       'jusho': '東京都港区新橋',
       'kaiso_disp': '10階/15階建',
       'kakaku': '10.6万円',
       'kanrihi': '15000円',
       'kotsu': '都営三田線/御成門駅 歩4分',
       'lg': 139.754712209268,
       'link': 'https://suumo.jp/chintai/bc_100373664556/',
       'lt': 35.6607384551484,
       'madori': '1K',
       'menseki': '22.07平米',
       'new_update_icon': 0,
       'reikin': '10.6万円',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100374712876',
       'bukken_nm': 'コンシェリア新橋SIX 10階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/876/100374712876/100374712876_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '8年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区新橋',
       'kaiso_disp': '10階/15階建',
       'kakaku': '10.6万円',
       'kanrihi': '15000円',
       'kotsu': '都営三田線/御成門駅 歩4分',
       'lg': 139.75469915742,
       'link': 'https://suumo.jp/chintai/bc_100374712876/',
       'lt': 35.6606612409428,
       'madori': '1K',
       'menseki': '22.07平米',
       'new_update_icon': 0,
       'reikin': '10.6万円',
       'shikikin': '-',
       'shubetsu': '040'},
      {'bukken_cd': '100373417891',
       'bukken_nm': 'アルテリア浜松町 8階',
       'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/891/100373417891/100373417891_gw.jpg',
       'category': '賃貸',
       'chikugonensu': '22年',
       'juko_nayose_cnt': 1,
       'jusho': '東京都港区浜松町',
       'kaiso_disp': '8階/9階建',
       'kakaku': '11万円',
       'kanrihi': '10000円',
       'kotsu': '都営浅草線/大門駅 歩5分',
       'lg': 139.75593800464,
       'link': 'https://suumo.jp/chintai/bc_100373417891/',
       'lt': 35.6587753662341,
       'madori': '1K',
       'menseki': '23.5平米',
       'new_update_icon': 0,
       'reikin': '11万円',
       'shikikin': '-',
       'shubetsu': '040'}]]




```python
article_list[0][0]
```




    {'bukken_cd': '100380073987',
     'bukken_nm': '大門 1K 4階',
     'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/987/100380073987/100380073987_gw.jpg',
     'category': '賃貸',
     'chikugonensu': '22年',
     'juko_nayose_cnt': 15,
     'jusho': '東京都港区芝大門',
     'kaiso_disp': '4階/地下1地上10階建',
     'kakaku': '13.8万円',
     'kanrihi': '12000円',
     'kotsu': '都営大江戸線/大門駅 歩3分',
     'lg': 139.753286392348,
     'link': 'https://suumo.jp/chintai/bc_100380073987/',
     'lt': 35.6555964743216,
     'madori': '1K',
     'menseki': '26.35平米',
     'new_update_icon': 1,
     'reikin': '-',
     'shikikin': '-',
     'shubetsu': '040'}




```python
article_list1 = [i for i in article_list[0]]
```


```python
article_list1[0] #굳
```




    {'bukken_cd': '100380073987',
     'bukken_nm': '大門 1K 4階',
     'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/987/100380073987/100380073987_gw.jpg',
     'category': '賃貸',
     'chikugonensu': '22年',
     'juko_nayose_cnt': 15,
     'jusho': '東京都港区芝大門',
     'kaiso_disp': '4階/地下1地上10階建',
     'kakaku': '13.8万円',
     'kanrihi': '12000円',
     'kotsu': '都営大江戸線/大門駅 歩3分',
     'lg': 139.753286392348,
     'link': 'https://suumo.jp/chintai/bc_100380073987/',
     'lt': 35.6555964743216,
     'madori': '1K',
     'menseki': '26.35平米',
     'new_update_icon': 1,
     'reikin': '-',
     'shikikin': '-',
     'shubetsu': '040'}




```python
len(article_list1)
```




    20



## Takadanobaba


```python
Takadanobaba = []
for i in tqdm(range(1, 41)): #페이지 넘버를 1부터 41까지 굴림
    try:
        url = f'https://suumo.jp/jj/JJ903FC020/?UID=smapi343&STMP=1715077124&ATT=768c96473867bdac98fc622ae1747ef6e3b9bad7&FORMAT=1&CALLBACK=SUUMO.CALLBACK.FUNCTION&P={i}&CNT=20&GAZO=2&PROT=1&SE=040&CINM=01&CINM=02&KUKEIPT1LT=35.71790510528776&KUKEIPT1LG=139.7162113440301&KUKEIPT2LT=35.70572654055912&KUKEIPT2LG=139.69426014545223'

        user_agent = generate_user_agent()
        headers = {'User-Agent':user_agent}

        res = requests.get(url, headers=headers)
        time.sleep(1)

        article_json = res.json()
        article_body = article_json['smatch']['resultset']['item']
        Takadanobaba.append(article_body) #위에서 얻은 정보를 리스트에다가 저장
    except: #try-excep문: 페이지 넘버가 100까지 없을 수도 있는데 일단 해라
        break
```


      0%|          | 0/40 [00:00<?, ?it/s]



```python
Takadanobaba[0]
```




    [{'bukken_cd': '100345417030',
      'bukken_nm': '高田馬場 1K 4階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/030/100345417030/100345417030_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '28年',
      'juko_nayose_cnt': 2,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '4階/地下1地上5階建',
      'kakaku': '10万円',
      'kanrihi': '5000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩1分',
      'lg': 139.705437866892,
      'link': 'https://suumo.jp/chintai/bc_100345417030/',
      'lt': 35.7118857376258,
      'madori': '1K',
      'menseki': '27.26平米',
      'new_update_icon': 0,
      'reikin': '10万円',
      'shikikin': '10万円',
      'shubetsu': '040'},
     {'bukken_cd': '100349001788',
      'bukken_nm': 'アサイガーデンコート 4階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/788/100349001788/100349001788_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '28年',
      'juko_nayose_cnt': 7,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '4階/5階建',
      'kakaku': '10万円',
      'kanrihi': '5000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩1分',
      'lg': 139.705462031919,
      'link': 'https://suumo.jp/chintai/bc_100349001788/',
      'lt': 35.7118740729607,
      'madori': '1K',
      'menseki': '27.26平米',
      'new_update_icon': 0,
      'reikin': '10万円',
      'shikikin': '10万円',
      'shubetsu': '040'},
     {'bukken_cd': '100370833179',
      'bukken_nm': '高田馬場 ワンルーム 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/179/100370833179/100370833179_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '28年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '1階/3階建',
      'kakaku': '7万円',
      'kanrihi': '3000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩2分',
      'lg': 139.705431486704,
      'link': 'https://suumo.jp/chintai/bc_100370833179/',
      'lt': 35.7116768723671,
      'madori': 'ワンルーム',
      'menseki': '14.22平米',
      'new_update_icon': 0,
      'reikin': '7万円(7万円)',
      'shikikin': '-(7万円)',
      'shubetsu': '040'},
     {'bukken_cd': '100375479915',
      'bukken_nm': '高田馬場ヒルサイドパレス 7階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/915/100375479915/100375479915_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '46年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '7階/10階建',
      'kakaku': '12万円',
      'kanrihi': '9000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩2分',
      'lg': 139.704695428556,
      'link': 'https://suumo.jp/chintai/bc_100375479915/',
      'lt': 35.7119545980151,
      'madori': 'ワンルーム',
      'menseki': '31.85平米',
      'new_update_icon': 0,
      'reikin': '12万円',
      'shikikin': '24万円',
      'shubetsu': '040'},
     {'bukken_cd': '100375480181',
      'bukken_nm': '高田馬場ヒルサイドパレス 9階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/181/100375480181/100375480181_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '46年',
      'juko_nayose_cnt': 2,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '9階/10階建',
      'kakaku': '12万円',
      'kanrihi': '9000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩2分',
      'lg': 139.704695428556,
      'link': 'https://suumo.jp/chintai/bc_100375480181/',
      'lt': 35.7119545980151,
      'madori': 'ワンルーム',
      'menseki': '32.03平米',
      'new_update_icon': 0,
      'reikin': '12万円',
      'shikikin': '24万円',
      'shubetsu': '040'},
     {'bukken_cd': '100372605497',
      'bukken_nm': '高田馬場 ワンルーム 7階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/497/100372605497/100372605497_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '46年',
      'juko_nayose_cnt': 2,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '7階/地下1地上10階建',
      'kakaku': '12万円',
      'kanrihi': '9000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩2分',
      'lg': 139.704542670085,
      'link': 'https://suumo.jp/chintai/bc_100372605497/',
      'lt': 35.7117990559513,
      'madori': 'ワンルーム',
      'menseki': '31.85平米',
      'new_update_icon': 0,
      'reikin': '12万円',
      'shikikin': '24万円',
      'shubetsu': '040'},
     {'bukken_cd': '100360606870',
      'bukken_nm': 'ハイム白雲 3階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/870/100360606870/100360606870_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '40年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '3階/5階建',
      'kakaku': '8.5万円',
      'kanrihi': '3000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩2分',
      'lg': 139.705038480881,
      'link': 'https://suumo.jp/chintai/bc_100360606870/',
      'lt': 35.7112760733263,
      'madori': '1K',
      'menseki': '25平米',
      'new_update_icon': 0,
      'reikin': '-',
      'shikikin': '8.5万円',
      'shubetsu': '040'},
     {'bukken_cd': '100365397524',
      'bukken_nm': 'コーポ華 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/524/100365397524/100365397524_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '37年',
      'juko_nayose_cnt': 3,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '2階/2階建',
      'kakaku': '8.2万円',
      'kanrihi': '-',
      'kotsu': '東京メトロ東西線/高田馬場駅 歩1分',
      'lg': 139.706575837699,
      'link': 'https://suumo.jp/chintai/bc_100365397524/',
      'lt': 35.711529698651,
      'madori': '1K',
      'menseki': '20.6平米',
      'new_update_icon': 0,
      'reikin': '-',
      'shikikin': '8.2万円',
      'shubetsu': '040'},
     {'bukken_cd': '100379140424',
      'bukken_nm': '高田馬場 ワンルーム 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/424/100379140424/100379140424_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '4年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '2階/2階建',
      'kakaku': '7.1万円',
      'kanrihi': '4000円',
      'kotsu': '東京メトロ東西線/高田馬場駅 歩2分',
      'lg': 139.706073964443,
      'link': 'https://suumo.jp/chintai/bc_100379140424/',
      'lt': 35.7108186534247,
      'madori': 'ワンルーム',
      'menseki': '10.02平米',
      'new_update_icon': 0,
      'reikin': '7.1万円',
      'shikikin': '7.1万円',
      'shubetsu': '040'},
     {'bukken_cd': '100375004344',
      'bukken_nm': '高田馬場 1K 3階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/344/100375004344/100375004344_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '32年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '3階/3階建',
      'kakaku': '8万円',
      'kanrihi': '-',
      'kotsu': '東京メトロ東西線/高田馬場駅 歩5分',
      'lg': 139.705281543093,
      'link': 'https://suumo.jp/chintai/bc_100375004344/',
      'lt': 35.7105664375654,
      'madori': '1K',
      'menseki': '21.45平米',
      'new_update_icon': 0,
      'reikin': '8万円',
      'shikikin': '8万円',
      'shubetsu': '040'},
     {'bukken_cd': '100377068730',
      'bukken_nm': 'アルビオン\u3000山の手 3階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/730/100377068730/100377068730_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '32年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '3階/8階建',
      'kakaku': '8万円',
      'kanrihi': '-',
      'kotsu': '西武新宿線/高田馬場駅 歩5分',
      'lg': 139.705214883303,
      'link': 'https://suumo.jp/chintai/bc_100377068730/',
      'lt': 35.7105386610612,
      'madori': '1K',
      'menseki': '21.45平米',
      'new_update_icon': 0,
      'reikin': '8万円',
      'shikikin': '8万円',
      'shubetsu': '040'},
     {'bukken_cd': '100262187193',
      'bukken_nm': 'アルビオン山の手 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/193/100262187193/100262187193_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '32年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '1階/3階建',
      'kakaku': '8万円',
      'kanrihi': '-',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩5分',
      'lg': 139.705239881587,
      'link': 'https://suumo.jp/chintai/bc_100262187193/',
      'lt': 35.7105269963973,
      'madori': '1K',
      'menseki': '21.45平米',
      'new_update_icon': 0,
      'reikin': '8万円',
      'shikikin': '8万円',
      'shubetsu': '040'},
     {'bukken_cd': '100377592256',
      'bukken_nm': 'プリエール諏訪 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/256/100377592256/100377592256_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '11年',
      'juko_nayose_cnt': 4,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '1階/3階建',
      'kakaku': '8.6万円',
      'kanrihi': '8000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩6分',
      'lg': 139.706959975677,
      'link': 'https://suumo.jp/chintai/bc_100377592256/',
      'lt': 35.7114108337698,
      'madori': 'ワンルーム',
      'menseki': '21.49平米',
      'new_update_icon': 1,
      'reikin': '8.6万円',
      'shikikin': '8.6万円',
      'shubetsu': '040'},
     {'bukken_cd': '100378978632',
      'bukken_nm': '高田馬場 ワンルーム 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/632/100378978632/100378978632_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '11年',
      'juko_nayose_cnt': 3,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '1階/3階建',
      'kakaku': '8.6万円',
      'kanrihi': '8000円',
      'kotsu': '東京メトロ東西線/高田馬場駅 歩6分',
      'lg': 139.706933590648,
      'link': 'https://suumo.jp/chintai/bc_100378978632/',
      'lt': 35.7113702820314,
      'madori': 'ワンルーム',
      'menseki': '21.49平米',
      'new_update_icon': 0,
      'reikin': '8.6万円',
      'shikikin': '8.6万円',
      'shubetsu': '040'},
     {'bukken_cd': '100371364978',
      'bukken_nm': 'グランビュー高田馬場 1階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/978/100371364978/100371364978_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '20年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '1階/2階建',
      'kakaku': '8.2万円',
      'kanrihi': '5000円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩2分',
      'lg': 139.707039970022,
      'link': 'https://suumo.jp/chintai/bc_100371364978/',
      'lt': 35.7113777841436,
      'madori': '1K',
      'menseki': '24.62平米',
      'new_update_icon': 0,
      'reikin': '8.2万円',
      'shikikin': '8.2万円',
      'shubetsu': '040'},
     {'bukken_cd': '100337734105',
      'bukken_nm': 'いこい荘 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/105/100337734105/100337734105_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '63年',
      'juko_nayose_cnt': 2,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '2階/2階建',
      'kakaku': '4.2万円',
      'kanrihi': '-',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩4分',
      'lg': 139.707303835408,
      'link': 'https://suumo.jp/chintai/bc_100337734105/',
      'lt': 35.711393900774,
      'madori': 'ワンルーム',
      'menseki': '10平米',
      'new_update_icon': 0,
      'reikin': '4.2万円',
      'shikikin': '4.2万円',
      'shubetsu': '040'},
     {'bukken_cd': '100337734104',
      'bukken_nm': 'いこい荘 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/104/100337734104/100337734104_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '63年',
      'juko_nayose_cnt': 2,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '2階/2階建',
      'kakaku': '4.2万円',
      'kanrihi': '-',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩4分',
      'lg': 139.707303835408,
      'link': 'https://suumo.jp/chintai/bc_100337734104/',
      'lt': 35.711393900774,
      'madori': 'ワンルーム',
      'menseki': '10平米',
      'new_update_icon': 0,
      'reikin': '4.2万円',
      'shikikin': '4.2万円',
      'shubetsu': '040'},
     {'bukken_cd': '100380057593',
      'bukken_nm': 'いこい荘 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/593/100380057593/100380057593_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '63年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '2階/2階建',
      'kakaku': '4万円',
      'kanrihi': '2600円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩3分',
      'lg': 139.707304946466,
      'link': 'https://suumo.jp/chintai/bc_100380057593/',
      'lt': 35.7113927898184,
      'madori': 'ワンルーム',
      'menseki': '10平米',
      'new_update_icon': 1,
      'reikin': '4万円',
      'shikikin': '4万円',
      'shubetsu': '040'},
     {'bukken_cd': '100356968432',
      'bukken_nm': 'いこい荘 2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/432/100356968432/100356968432_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '63年',
      'juko_nayose_cnt': 3,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '2階/2階建',
      'kakaku': '4万円',
      'kanrihi': '2600円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩3分',
      'lg': 139.707304946466,
      'link': 'https://suumo.jp/chintai/bc_100356968432/',
      'lt': 35.7113927898184,
      'madori': 'ワンルーム',
      'menseki': '10平米',
      'new_update_icon': 0,
      'reikin': '4万円',
      'shikikin': '4万円',
      'shubetsu': '040'},
     {'bukken_cd': '100377512094',
      'bukken_nm': 'いこい荘 1-2階',
      'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/094/100377512094/100377512094_gw.jpg',
      'category': '賃貸',
      'chikugonensu': '63年',
      'juko_nayose_cnt': 1,
      'jusho': '東京都新宿区高田馬場',
      'kaiso_disp': '1-2階/2階建',
      'kakaku': '6万円',
      'kanrihi': '3800円',
      'kotsu': 'ＪＲ山手線/高田馬場駅 歩3分',
      'lg': 139.707304946466,
      'link': 'https://suumo.jp/chintai/bc_100377512094/',
      'lt': 35.7113927898184,
      'madori': '1K',
      'menseki': '15平米',
      'new_update_icon': 0,
      'reikin': '6万円',
      'shikikin': '6万円',
      'shubetsu': '040'}]




```python
Takadanobaba_result=[]
for sublist in Takadanobaba:
    for item in sublist:
        Takadanobaba_result.append(item)
```


```python
Takadanobaba_result[0]
```




    {'bukken_cd': '100345417030',
     'bukken_nm': '高田馬場 1K 4階',
     'bukkengazo': 'https://img01.suumo.com/front/gazo/fr/bukken/030/100345417030/100345417030_gw.jpg',
     'category': '賃貸',
     'chikugonensu': '28年',
     'juko_nayose_cnt': 2,
     'jusho': '東京都新宿区高田馬場',
     'kaiso_disp': '4階/地下1地上5階建',
     'kakaku': '10万円',
     'kanrihi': '5000円',
     'kotsu': 'ＪＲ山手線/高田馬場駅 歩1分',
     'lg': 139.705437866892,
     'link': 'https://suumo.jp/chintai/bc_100345417030/',
     'lt': 35.7118857376258,
     'madori': '1K',
     'menseki': '27.26平米',
     'new_update_icon': 0,
     'reikin': '10万円',
     'shikikin': '10万円',
     'shubetsu': '040'}




```python
Takadanobaba_DF = pd.DataFrame(Takadanobaba_result)
Takadanobaba_DF.head(3)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bukken_cd</th>
      <th>bukken_nm</th>
      <th>bukkengazo</th>
      <th>category</th>
      <th>chikugonensu</th>
      <th>juko_nayose_cnt</th>
      <th>jusho</th>
      <th>kaiso_disp</th>
      <th>kakaku</th>
      <th>kanrihi</th>
      <th>kotsu</th>
      <th>lg</th>
      <th>link</th>
      <th>lt</th>
      <th>madori</th>
      <th>menseki</th>
      <th>new_update_icon</th>
      <th>reikin</th>
      <th>shikikin</th>
      <th>shubetsu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100345417030</td>
      <td>高田馬場 1K 4階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/0...</td>
      <td>賃貸</td>
      <td>28年</td>
      <td>2</td>
      <td>東京都新宿区高田馬場</td>
      <td>4階/地下1地上5階建</td>
      <td>10万円</td>
      <td>5000円</td>
      <td>ＪＲ山手線/高田馬場駅 歩1分</td>
      <td>139.705438</td>
      <td>https://suumo.jp/chintai/bc_100345417030/</td>
      <td>35.711886</td>
      <td>1K</td>
      <td>27.26平米</td>
      <td>0</td>
      <td>10万円</td>
      <td>10万円</td>
      <td>040</td>
    </tr>
    <tr>
      <th>1</th>
      <td>100349001788</td>
      <td>アサイガーデンコート 4階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/7...</td>
      <td>賃貸</td>
      <td>28年</td>
      <td>7</td>
      <td>東京都新宿区高田馬場</td>
      <td>4階/5階建</td>
      <td>10万円</td>
      <td>5000円</td>
      <td>ＪＲ山手線/高田馬場駅 歩1分</td>
      <td>139.705462</td>
      <td>https://suumo.jp/chintai/bc_100349001788/</td>
      <td>35.711874</td>
      <td>1K</td>
      <td>27.26平米</td>
      <td>0</td>
      <td>10万円</td>
      <td>10万円</td>
      <td>040</td>
    </tr>
    <tr>
      <th>2</th>
      <td>100370833179</td>
      <td>高田馬場 ワンルーム 1階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/1...</td>
      <td>賃貸</td>
      <td>28年</td>
      <td>1</td>
      <td>東京都新宿区高田馬場</td>
      <td>1階/3階建</td>
      <td>7万円</td>
      <td>3000円</td>
      <td>ＪＲ山手線/高田馬場駅 歩2分</td>
      <td>139.705431</td>
      <td>https://suumo.jp/chintai/bc_100370833179/</td>
      <td>35.711677</td>
      <td>ワンルーム</td>
      <td>14.22平米</td>
      <td>0</td>
      <td>7万円(7万円)</td>
      <td>-(7万円)</td>
      <td>040</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.set_option('display.max_columns', None)
Takadanobaba_DF.head(1)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bukken_cd</th>
      <th>bukken_nm</th>
      <th>bukkengazo</th>
      <th>category</th>
      <th>chikugonensu</th>
      <th>juko_nayose_cnt</th>
      <th>jusho</th>
      <th>kaiso_disp</th>
      <th>kakaku</th>
      <th>kanrihi</th>
      <th>kotsu</th>
      <th>lg</th>
      <th>link</th>
      <th>lt</th>
      <th>madori</th>
      <th>menseki</th>
      <th>new_update_icon</th>
      <th>reikin</th>
      <th>shikikin</th>
      <th>shubetsu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100345417030</td>
      <td>高田馬場 1K 4階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/0...</td>
      <td>賃貸</td>
      <td>28年</td>
      <td>2</td>
      <td>東京都新宿区高田馬場</td>
      <td>4階/地下1地上5階建</td>
      <td>10万円</td>
      <td>5000円</td>
      <td>ＪＲ山手線/高田馬場駅 歩1分</td>
      <td>139.705438</td>
      <td>https://suumo.jp/chintai/bc_100345417030/</td>
      <td>35.711886</td>
      <td>1K</td>
      <td>27.26平米</td>
      <td>0</td>
      <td>10万円</td>
      <td>10万円</td>
      <td>040</td>
    </tr>
  </tbody>
</table>
</div>




```python
Takadanobaba_needed = Takadanobaba_DF[['bukken_cd','chikugonensu','kaiso_disp','kakaku','kanrihi','kotsu','madori','menseki','reikin', 'shikikin' ]]
#필요한 것들만 뽑아
Takadanobaba_needed.columns = ['ID','Year','Floor','Monthly','Maintain','Transportation','Type','Area(m2)','Reikin', 'Shikikin']
#컬럼들 이름 바꾸기
```


```python
Takadanobaba_needed.head(3)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ID</th>
      <th>Year</th>
      <th>Floor</th>
      <th>Monthly</th>
      <th>Maintain</th>
      <th>Transportation</th>
      <th>Type</th>
      <th>Area(m2)</th>
      <th>Reikin</th>
      <th>Shikikin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100345417030</td>
      <td>28年</td>
      <td>4階/地下1地上5階建</td>
      <td>10万円</td>
      <td>5000円</td>
      <td>ＪＲ山手線/高田馬場駅 歩1分</td>
      <td>1K</td>
      <td>27.26平米</td>
      <td>10万円</td>
      <td>10万円</td>
    </tr>
    <tr>
      <th>1</th>
      <td>100349001788</td>
      <td>28年</td>
      <td>4階/5階建</td>
      <td>10万円</td>
      <td>5000円</td>
      <td>ＪＲ山手線/高田馬場駅 歩1分</td>
      <td>1K</td>
      <td>27.26平米</td>
      <td>10万円</td>
      <td>10万円</td>
    </tr>
    <tr>
      <th>2</th>
      <td>100370833179</td>
      <td>28年</td>
      <td>1階/3階建</td>
      <td>7万円</td>
      <td>3000円</td>
      <td>ＪＲ山手線/高田馬場駅 歩2分</td>
      <td>ワンルーム</td>
      <td>14.22平米</td>
      <td>7万円(7万円)</td>
      <td>-(7万円)</td>
    </tr>
  </tbody>
</table>
</div>




```python
Takadanobaba_needed.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 800 entries, 0 to 799
    Data columns (total 10 columns):
     #   Column          Non-Null Count  Dtype 
    ---  ------          --------------  ----- 
     0   ID              800 non-null    object
     1   Year            800 non-null    object
     2   Floor           800 non-null    object
     3   Monthly         800 non-null    object
     4   Maintain        800 non-null    object
     5   Transportation  800 non-null    object
     6   Type            800 non-null    object
     7   Area(m2)        800 non-null    object
     8   Reikin          800 non-null    object
     9   Shikikin        800 non-null    object
    dtypes: object(10)
    memory usage: 62.6+ KB
    


```python
Takadanobaba_needed.to_excel("Takadanobaba_needed.xlsx", index=False)
```

## Ochannomizu


```python
Ochanomizu = []
for i in tqdm(range(1, 41)): #페이지 넘버를 1부터 41까지 굴림
    try:
        url = f'https://suumo.jp/jj/JJ903FC020/?UID=smapi343&STMP=1715077500&ATT=1d33f66be2e7c67ce2e1d0a2f8b791638e332267&FORMAT=1&CALLBACK=SUUMO.CALLBACK.FUNCTION&P={i}&CNT=20&GAZO=2&PROT=1&SE=040&CINM=01&CINM=02&KUKEIPT1LT=35.7088014307794&KUKEIPT1LG=139.77569083672896&KUKEIPT2LT=35.69662147502494&KUKEIPT2LG=139.75373963815107'

        user_agent = generate_user_agent()
        headers = {'User-Agent':user_agent}

        res = requests.get(url, headers=headers)
        time.sleep(1)

        article_json = res.json()
        article_body = article_json['smatch']['resultset']['item']
        Ochanomizu.append(article_body) #위에서 얻은 정보를 리스트에다가 저장
    except: #try-excep문: 페이지 넘버가 100까지 없을 수도 있는데 일단 해라
        break
```


      0%|          | 0/40 [00:00<?, ?it/s]



```python
Ochanomizu_result=[]
for sublist in Ochanomizu:
    for item in sublist:
        Ochanomizu_result.append(item)
```


```python
Ochanomizu_DF = pd.DataFrame(Ochanomizu_result)
Ochanomizu_DF.head(3)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bukken_cd</th>
      <th>bukken_nm</th>
      <th>bukkengazo</th>
      <th>category</th>
      <th>chikugonensu</th>
      <th>juko_nayose_cnt</th>
      <th>jusho</th>
      <th>kaiso_disp</th>
      <th>kakaku</th>
      <th>kanrihi</th>
      <th>kotsu</th>
      <th>lg</th>
      <th>link</th>
      <th>lt</th>
      <th>madori</th>
      <th>menseki</th>
      <th>new_update_icon</th>
      <th>reikin</th>
      <th>shikikin</th>
      <th>shubetsu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100377925053</td>
      <td>御茶ノ水 ワンルーム 1階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/0...</td>
      <td>賃貸</td>
      <td>1年</td>
      <td>4</td>
      <td>東京都文京区湯島</td>
      <td>1階/5階建</td>
      <td>10.4万円</td>
      <td>10000円</td>
      <td>東京メトロ丸ノ内線/御茶ノ水駅 歩7分</td>
      <td>139.765075</td>
      <td>https://suumo.jp/chintai/bc_100377925053/</td>
      <td>35.703732</td>
      <td>ワンルーム</td>
      <td>20.37平米</td>
      <td>0</td>
      <td>-</td>
      <td>10.4万円</td>
      <td>040</td>
    </tr>
    <tr>
      <th>1</th>
      <td>100372431846</td>
      <td>アトリオフラッツ御茶ノ水 1階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/8...</td>
      <td>賃貸</td>
      <td>新築</td>
      <td>28</td>
      <td>東京都文京区湯島</td>
      <td>1階/5階建</td>
      <td>10.4万円</td>
      <td>10000円</td>
      <td>東京メトロ丸ノ内線/御茶ノ水駅 歩7分</td>
      <td>139.765122</td>
      <td>https://suumo.jp/chintai/bc_100372431846/</td>
      <td>35.703086</td>
      <td>ワンルーム</td>
      <td>20.37平米</td>
      <td>0</td>
      <td>-</td>
      <td>10.4万円</td>
      <td>040</td>
    </tr>
    <tr>
      <th>2</th>
      <td>100372887568</td>
      <td>アトリオフラッツ御茶ノ水 1階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/5...</td>
      <td>賃貸</td>
      <td>新築</td>
      <td>10</td>
      <td>東京都文京区湯島</td>
      <td>1階/5階建</td>
      <td>10.3万円</td>
      <td>10000円</td>
      <td>東京メトロ丸ノ内線/御茶ノ水駅 歩6分</td>
      <td>139.765122</td>
      <td>https://suumo.jp/chintai/bc_100372887568/</td>
      <td>35.703084</td>
      <td>ワンルーム</td>
      <td>18.64平米</td>
      <td>0</td>
      <td>-</td>
      <td>10.3万円</td>
      <td>040</td>
    </tr>
  </tbody>
</table>
</div>




```python
Ochanomizu_needed = Ochanomizu_DF[['bukken_cd','chikugonensu','kaiso_disp','kakaku','kanrihi','kotsu','madori','menseki','reikin', 'shikikin' ]]
#필요한 것들만 뽑아
Ochanomizu_needed.columns = ['ID','Year','Floor','Monthly','Maintain','Transportation','Type','Area(m2)','Reikin', 'Shikikin']
#컬럼들 이름 바꾸기
```


```python
Ochanomizu_needed.head(3)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ID</th>
      <th>Year</th>
      <th>Floor</th>
      <th>Monthly</th>
      <th>Maintain</th>
      <th>Transportation</th>
      <th>Type</th>
      <th>Area(m2)</th>
      <th>Reikin</th>
      <th>Shikikin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100377925053</td>
      <td>1年</td>
      <td>1階/5階建</td>
      <td>10.4万円</td>
      <td>10000円</td>
      <td>東京メトロ丸ノ内線/御茶ノ水駅 歩7分</td>
      <td>ワンルーム</td>
      <td>20.37平米</td>
      <td>-</td>
      <td>10.4万円</td>
    </tr>
    <tr>
      <th>1</th>
      <td>100372431846</td>
      <td>新築</td>
      <td>1階/5階建</td>
      <td>10.4万円</td>
      <td>10000円</td>
      <td>東京メトロ丸ノ内線/御茶ノ水駅 歩7分</td>
      <td>ワンルーム</td>
      <td>20.37平米</td>
      <td>-</td>
      <td>10.4万円</td>
    </tr>
    <tr>
      <th>2</th>
      <td>100372887568</td>
      <td>新築</td>
      <td>1階/5階建</td>
      <td>10.3万円</td>
      <td>10000円</td>
      <td>東京メトロ丸ノ内線/御茶ノ水駅 歩6分</td>
      <td>ワンルーム</td>
      <td>18.64平米</td>
      <td>-</td>
      <td>10.3万円</td>
    </tr>
  </tbody>
</table>
</div>




```python
Ochanomizu_needed.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 730 entries, 0 to 729
    Data columns (total 10 columns):
     #   Column          Non-Null Count  Dtype 
    ---  ------          --------------  ----- 
     0   ID              730 non-null    object
     1   Year            730 non-null    object
     2   Floor           730 non-null    object
     3   Monthly         730 non-null    object
     4   Maintain        730 non-null    object
     5   Transportation  730 non-null    object
     6   Type            730 non-null    object
     7   Area(m2)        730 non-null    object
     8   Reikin          730 non-null    object
     9   Shikikin        730 non-null    object
    dtypes: object(10)
    memory usage: 57.2+ KB
    


```python
Ochanomizu_needed.to_excel("Ochanomizu_needed.xlsx", index=False)
```

## Meidaimae


```python
Meidaimae = []
for i in tqdm(range(1, 41)): #페이지 넘버를 1부터 41까지 굴림
    try:
        url = f'https://suumo.jp/jj/JJ903FC020/?UID=smapi343&STMP=1715078623&ATT=653f5bf7b1ea09e97fef52ba173afd5374f8c715&FORMAT=1&CALLBACK=SUUMO.CALLBACK.FUNCTION&P={i}&CNT=20&GAZO=2&PROT=1&SE=040&CINM=01&CINM=02&KUKEIPT1LT=35.674533062074794&KUKEIPT1LG=139.66146639928894&KUKEIPT2LT=35.662347872930674&KUKEIPT2LG=139.63951520071106'

        user_agent = generate_user_agent()
        headers = {'User-Agent':user_agent}

        res = requests.get(url, headers=headers)
        time.sleep(1)

        article_json = res.json()
        article_body = article_json['smatch']['resultset']['item']
        Meidaimae.append(article_body) #위에서 얻은 정보를 리스트에다가 저장
    except: #try-excep문: 페이지 넘버가 100까지 없을 수도 있는데 일단 해라
        break
```


      0%|          | 0/40 [00:00<?, ?it/s]



```python
Meidaimae_result=[]
for sublist in Meidaimae:
    for item in sublist:
        Meidaimae_result.append(item)
```


```python
Meidaimae_DF = pd.DataFrame(Meidaimae_result)
Meidaimae_DF.head(3)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bukken_cd</th>
      <th>bukken_nm</th>
      <th>bukkengazo</th>
      <th>category</th>
      <th>chikugonensu</th>
      <th>juko_nayose_cnt</th>
      <th>jusho</th>
      <th>kaiso_disp</th>
      <th>kakaku</th>
      <th>kanrihi</th>
      <th>kotsu</th>
      <th>lg</th>
      <th>link</th>
      <th>lt</th>
      <th>madori</th>
      <th>menseki</th>
      <th>new_update_icon</th>
      <th>reikin</th>
      <th>shikikin</th>
      <th>shubetsu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100376876960</td>
      <td>明大前 1K 3階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/9...</td>
      <td>賃貸</td>
      <td>36年</td>
      <td>1</td>
      <td>東京都世田谷区松原</td>
      <td>3階/5階建</td>
      <td>7.5万円</td>
      <td>-</td>
      <td>京王線/明大前駅 歩1分</td>
      <td>139.650930</td>
      <td>https://suumo.jp/chintai/bc_100376876960/</td>
      <td>35.669025</td>
      <td>1K</td>
      <td>24.19平米</td>
      <td>0</td>
      <td>-</td>
      <td>7.5万円</td>
      <td>040</td>
    </tr>
    <tr>
      <th>1</th>
      <td>100361610696</td>
      <td>明大前 ワンルーム 3階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/6...</td>
      <td>賃貸</td>
      <td>32年</td>
      <td>2</td>
      <td>東京都世田谷区松原</td>
      <td>3階/3階建</td>
      <td>5.9万円</td>
      <td>-</td>
      <td>京王線/明大前駅 歩2分</td>
      <td>139.649608</td>
      <td>https://suumo.jp/chintai/bc_100361610696/</td>
      <td>35.668375</td>
      <td>ワンルーム</td>
      <td>19平米</td>
      <td>0</td>
      <td>5.9万円</td>
      <td>5.9万円</td>
      <td>040</td>
    </tr>
    <tr>
      <th>2</th>
      <td>100372292032</td>
      <td>ハイツ明大前 1階</td>
      <td>https://img01.suumo.com/front/gazo/fr/bukken/0...</td>
      <td>賃貸</td>
      <td>47年</td>
      <td>1</td>
      <td>東京都世田谷区松原</td>
      <td>1階/3階建</td>
      <td>5万円</td>
      <td>1000円</td>
      <td>京王線/明大前駅 歩1分</td>
      <td>139.649625</td>
      <td>https://suumo.jp/chintai/bc_100372292032/</td>
      <td>35.668235</td>
      <td>1K</td>
      <td>16.5平米</td>
      <td>0</td>
      <td>5万円</td>
      <td>5万円</td>
      <td>040</td>
    </tr>
  </tbody>
</table>
</div>




```python
Meidaimae_needed = Meidaimae_DF[['bukken_cd','chikugonensu','kaiso_disp','kakaku','kanrihi','kotsu','madori','menseki','reikin', 'shikikin' ]]
#필요한 것들만 뽑아
Meidaimae_needed.columns = ['ID','Year','Floor','Monthly','Maintain','Transportation','Type','Area(m2)','Reikin', 'Shikikin']
#컬럼들 이름 바꾸기
```


```python
Meidaimae_needed.head(3)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ID</th>
      <th>Year</th>
      <th>Floor</th>
      <th>Monthly</th>
      <th>Maintain</th>
      <th>Transportation</th>
      <th>Type</th>
      <th>Area(m2)</th>
      <th>Reikin</th>
      <th>Shikikin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100376876960</td>
      <td>36年</td>
      <td>3階/5階建</td>
      <td>7.5万円</td>
      <td>-</td>
      <td>京王線/明大前駅 歩1分</td>
      <td>1K</td>
      <td>24.19平米</td>
      <td>-</td>
      <td>7.5万円</td>
    </tr>
    <tr>
      <th>1</th>
      <td>100361610696</td>
      <td>32年</td>
      <td>3階/3階建</td>
      <td>5.9万円</td>
      <td>-</td>
      <td>京王線/明大前駅 歩2分</td>
      <td>ワンルーム</td>
      <td>19平米</td>
      <td>5.9万円</td>
      <td>5.9万円</td>
    </tr>
    <tr>
      <th>2</th>
      <td>100372292032</td>
      <td>47年</td>
      <td>1階/3階建</td>
      <td>5万円</td>
      <td>1000円</td>
      <td>京王線/明大前駅 歩1分</td>
      <td>1K</td>
      <td>16.5平米</td>
      <td>5万円</td>
      <td>5万円</td>
    </tr>
  </tbody>
</table>
</div>




```python
Meidaimae_needed.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 800 entries, 0 to 799
    Data columns (total 10 columns):
     #   Column          Non-Null Count  Dtype 
    ---  ------          --------------  ----- 
     0   ID              800 non-null    object
     1   Year            800 non-null    object
     2   Floor           800 non-null    object
     3   Monthly         800 non-null    object
     4   Maintain        800 non-null    object
     5   Transportation  800 non-null    object
     6   Type            800 non-null    object
     7   Area(m2)        800 non-null    object
     8   Reikin          800 non-null    object
     9   Shikikin        800 non-null    object
    dtypes: object(10)
    memory usage: 62.6+ KB
    


```python
Meidaimae_needed.to_excel("Meidaimae_needed.xlsx", index=False)
```
