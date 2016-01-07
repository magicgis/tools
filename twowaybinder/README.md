# Two-Way Binder

##
* 본 문서는 RealGridJS와 form안에 정의된 Element간에 Two-Way Binding을 설정하는 방법에 대해 소개합니다.  

> *RealGridJS의 Two-Way Binding이란*  
> <mark>그리드의 필드</mark>와 form 안의 <mark>element</mark> 간에 <mark>상호작용</mark>을 위한 기능입니다.  
> 동작방법으로 한 행을 선택 후 데이터를 입력하면  
> 입력중인 필드와 연결된 element의 값이 동일하게 변경되고  
> 그 반대로 element에 값을 입력하면 연결된 필드의 데이터가 동일하게 변경됩니다.  

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
    fieldName : "OrderID"
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

> <mark>주의사항</mark>  
> 폼 안에 연결 가능한 element는 input, select, textarea로 한정되어 있습니다.

#### Event Function

그리드에 데이터를 변경시 element의 데이터를 변경하기 위해 이벤트함수를 사용하였습니다.  
때문에 two-way에 사용한 이벤트함수를 다시 정의해서 사용하면 two-way기능이 동작하지 않게 됩니다.  

> two-way에 정의된 이벤트 함수  
> GridBase.onCurrentRowChanged  
> GridBase.onCurrentChanging   
> GridBase.onEditChange  
> GridBase.onEditCanceled  
> GridBase.onEditRowChanged  
> GridBase.onKeyDown  
> GridBase.onKeyUp  

위와같은 상황을 방지하기 위해 새로 정의한 이벤트 함수에 다음과 같은 코드를 추가해야 합니다.  

<pre class="prettyprint">
grid.onEditChange = function(grid, index, value){
	//재정의 해도 무관하게 동작도록 apply 적용.
	rgBind.onEditChange.apply(rgBind, arguments);
	console.log("dev onEditChange");
}
</pre>

> [apply](https://msdn.microsoft.com/ko-kr/library/4zc42wh1.aspx)  
> 함수를 호출하여 지정된 개체를 함수의 this 값으로 대체하고 지정된 배열을 함수의 인수로 대체합니다.  
> two-way에 정의한 이벤트 함수에는 apply에 지정한 this 값을 사용하지 않기 때문에 다른 값을 지정하여도 무관합니다.  


