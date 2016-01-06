# Two-Way Binder

##
* 본 문서는 RealGridJS와 form안에 정의된 Element와 상호작용을 하는 방법을 소개합니다.

##

### 설치하기

RealGridJS를 설치 할 때 realgridjs-twoway.js파일을 같이 설치합니다.  
기본 설치는 튜토리얼 [A1](http://help.realgrid.com/tutorial/a1/){:target="_blank"}를 참조해 주십시오.
그리드의 달려과 매칭되는 기능을 위해 jquery Datepicker를 사용하였기 때문에 jqeury와 jquery ui도 설치합니다.


<pre class="prettyprint">
// jquery
&lt;link href=&quot;js/jquery-ui.css&quot; rel=&quot;stylesheet&quot;&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;js/jquery-1.11.1.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;js/jquery-ui.js&quot;&gt;&lt;/script&gt;

// realgrid js
&lt;script type=&quot;text/javascript&quot; src=&quot;lib/realgridjs-lic.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;lib/realgridjs_eval.1.0.13.min.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;lib/realgridjs-api.1.0.13.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;lib/jszip.min.js&quot;&gt;&lt;/script&gt;

// two-way binding
&lt;script type=&quot;text/javascript&quot; src=&quot;lib/realgridjs-twoway.js&quot;&gt;&lt;/script&gt;
</pre>




