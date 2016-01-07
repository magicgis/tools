# Two-Way Binder

##
* 본 문서는 RealGridJS와 form안에 정의된 Element간에 Two-Way Binding을 설정하는 방법에 대해 소개합니다.  

> *RealGridJS의 Two-Way Binding이란*  
> 그리드의 필드와 특정 form안의 element를 연결하여 한 행을 선택 후 데이터를 입력하면  
> 입력중인 셀의 필드와 연결된 element의 값이 동일하게 변경되고  
> 그 반대로 element에 값을 입력하면 연결된 필드의 셀에 데이터가 동일하게 설정되는 기능입니다.   

##

### 설치하기

RealGridJS를 설치 할 때 realgridjs-twoway.js파일을 같이 설치합니다.  
기본 설치는 튜토리얼 [A1](http://help.realgrid.com/tutorial/a1/)를 참조해 주십시오.  
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

#### Javascript

Two-Way Binding(앞으로 two-way로 지칭) 기능을 사용하기 위해서는 그리드를 셋업하는 과정에 two-way 셋업 코드를 추가해야합니다.  
two-way 클래스를 생성 후 bindForm 함수를 호출하면 two-way 설정은 완료됩니다.  

이때 주의 할 점은 DataField와 DataColumn이 생성된 후 bindForm함수를 호출해야 합니다.  

<pre class="prettyprint">
RealGridJS.setRootContext("lib");
gridView = new RealGridJS.GridView("realgrid");
dataProvider = new RealGridJS.LocalDataProvider();
gridView.setDataSource(dataProvider);

setFields(dataProvider);
setColumns(gridView);

rgBind = new RealGridFormBinder();
// bindForm의 parameter로 GridView, DataProvider, Form Id를 설정합니다.
rgBind.bindForm(gridView, dataProvider, "bindForm");

dataProvider.fillJsonData(jArr);
</pre>

#### HTML

그리드의 필드와 HTML의 element를 연결하기 하려면 상호간에 명시 된 값이 필요합니다.
그 값은 그리드의 필드명으로 element에 rgField 속성을 추가 후 reField의 속성 값으로 필드명을 지정 합니다.

<pre class="prettyprint">
fields = [{
    fieldName : "Check"
}, {
    fieldName : "OrderID",
    dataType : "text"
}, {
    fieldName : "CustomerID"
}, {
    fieldName : "EmployeeID"
}, {
    fieldName : "OrderDate",
    dataType : "datetime"
}, {
    fieldName : "CompanyName"
}, {
    fieldName : "Country"
}, {
    fieldName : "Phone"
}, {
    fieldName : "ProductName"
}, {
    fieldName : "QuantityPerUnit"
}, {
    fieldName : "Quantity",
    dataType : "number"
}, {
    fieldName : "UnitPrice",
    dataType : "number"
}];
 
provider.setFields(fields);

&lt;input type=&quot;checkBox&quot; rgField=&quot;Check&quot; /&gt;
&lt;input type=&quot;text&quot; rgField=&quot;OrderID&quot; /&gt;
&lt;select rgField=&quot;CustomerID&quot; &gt;&lt;/select&gt;
&lt;input type=&quot;text&quot; rgField=&quot;OrderDate&quot; id=&quot;datepicker&quot;/&gt;
&lt;input type=&quot;number&quot; rgField=&quot;Quantity&quot; /&gt;
&lt;input type=&quot;text&quot; rgField=&quot;CompanyName&quot; /&gt;
&lt;input type=&quot;text&quot; rgField=&quot;Country&quot; /&gt;
&lt;input type=&quot;text&quot; rgField=&quot;Phone&quot; /&gt;
&lt;textarea rgField=&quot;ProductName&quot; style=&quot;width : 360px;&quot; &gt;&lt;/textarea&gt;
</pre>



