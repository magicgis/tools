/*!
* RealGridJS Two-Way Binding v0.7
* 2016/01/06 yoogi82@wrw.kr
*/

var RealGridFormBinder = function (){
	var rgFields = null;
	var formFields = null;
	var formElt = null;
	var formElts = null;
	var focusIndex = null;
	var _rg = null;
	var _gvdp = null;
	var oldItemState = null;

	///// setup //////////
	var bindForm = function(gv, dp, formId){
		_rg = this;
		_gvdp = { 
			_gv : gv , 
			_dp : dp, 
			_options : {
				_dateFormat : { datetimeFormat : "yyyy/MM/dd" } // input text box에 해당 포멧으로 값지정
			} 
		};
		
		this._formId = formId;
		var $formChild = findFormInAllElts(formId);
		_rg.focusIndex = gv.getCurrent();
		_rg.rgFields = dp.getOrgFieldNames();
		_rg.formElts = [], _rg.formFields = [];
		
		$.map($formChild, function(attr){
			var field = $(attr).attr("rgfield");
			if(field){
				_rg.formElts = _rg.formElts.concat([attr]);
				_rg.formFields = _rg.formFields.concat([field]);
				if(field == gv.getCurrent().fieldName){
					_rg.boundElt = attr;
				}
				// 폼 --> 그리드
				bindGridCell(gv, attr);
			}
		});
		
		// 그리드 -> 폼
		gv.onCurrentRowChanged = onCurrentRowChanged;
		gv.onCurrentChanging = onCurrentChanging;
		gv.onEditChange = onEditChange;
		gv.onEditCanceled = onEditCanceled;
		gv.onEditRowChanged = onEditRowChanged;
		gv.onKeyDown = onKeyDown;
		gv.onKeyUp = onKeyUp;
	}
	
	///// private function ////////////////////
	function findFormInAllElts(formId){
		var formInput = $("#"+formId).find("input").toArray();
		var formTxtArea = $("#"+formId).find("textarea").toArray();
		var formSlt = $("#"+formId).find("select").toArray();
		var formChild = formInput.concat(formTxtArea, formSlt);
		return formChild;
	}
	
	function bindGridCell(grid, elt){
		var col = grid.columnByField($(elt).attr("rgField"));
		var renderer = grid.getColumnProperty(col, "renderer");
		if(renderer && renderer.type === "check"){
			$changeChk(grid, elt, renderer);
		}else if(col.values.length > 0 && elt.tagName == "SELECT"){
			fillSltOpt(col, elt);
			$changeTxt(grid, elt, col);
		}else{
			$changeTxt(grid, elt, col);
		}
		
		$keyup(grid, elt);
		$keydown(grid, elt);
	}
	
	function fillSltOpt(col, elt){
		var options = "";
		for(var i=0; i < col.values.length; i++){
			var option = "<option value='";
			option += col.values[i];
			option += "' >";
			var label = col.labels.length > 0 ? col.labels[i] : col.values[i];
			option += label.replace(/\</gi, "&lt;").replace(/\>/gi, "&gt;");
			option += "</option>";
			options += option;
		}
		
		elt.innerHTML = options;
	}
	
	function $changeChk(grid, elt, renderer){
		$(elt).change(function(){
			var checked = $(this).is(":checked");
			var value = checked ? renderer.trueValues : renderer.falseValues;
			var index = getFocusIndex();
			grid.setValue(index.itemIndex, $(elt).attr("rgField"), value);
		});
	}
	
	function $changeTxt(grid, elt){
		$(elt).change(function(){
			var index = getFocusIndex();
			grid.commitEditor();
			grid.setValue(index.itemIndex, $(elt).attr("rgField"), this.value);
		});
	}
	
	function $keyup(grid, elt){
		$(elt).keyup(function(e){
			var itemState = grid.getItemState();
			console.log("up", itemState);
			var index = getFocusIndex();
			grid.commitEditor();
			grid.setValue(index.itemIndex, $(elt).attr("rgField"), this.value);
		});
	}
	
	function $keydown(grid, elt){
		$(elt).keydown(function(e){
			var itemState = grid.getItemState();
			console.log("down", itemState);
			var index = getFocusIndex();
			grid.commitEditor();
			grid.setValue(index.itemIndex, $(elt).attr("rgField"), this.value);
		});
	}
	
	////// event function //////
	// 편집 중 캔슬
	var onEditCanceled = function(grid, index){
		var $elt = _rg.getBoundElt();
		if(index.dataRow < 0) {
			$elt.val(undefined);
			return;
		}
		var value = _gvdp._dp.getOutputRow(_gvdp._options._dateFormat,index.dataRow)[$elt.attr("rgField")];
		$elt.val(value);
	}
	
	var onCurrentRowChanged = function(grid, oldRow, newRow){
		if(newRow < 0) {
			clearEltsVal();
			return;
		}
		clearEltsVal();
		fillAllEltsVal(grid, newRow);
	}
	
	var onCurrentChanging = function(grid, oldIndex, newIndex){
		setFocusIndex(newIndex);
		setBoundElt(newIndex);
	}
	
	// 한행 붙여넣기
	var onEditRowChanged = function(grid, itemIndex, dataRow, field, oldvalue, newValue){
		console.log("rgeditrowchange", newValue);
		var fieldNames = _gvdp._dp.getOrgFieldNames();
		var fieldName = fieldNames[field];
		var $elt = $(_rg.eltByField(fieldName));
		var col = grid.columnByField(fieldName);
		var renderer = grid.getColumnProperty(col, "renderer");
		if(newValue instanceof Date){
			newValue = new Date(newValue).rgformat("yyyy/MM/dd");
			$elt.val(newValue);
		}else if(renderer && renderer.type === "check"){
			if(renderer.trueValues == newValue){
				$elt[0].checked = true;
			}else{
				$elt[0].checked = false;
			}
		}else
			$elt.val(newValue);
	}
	
	var onEditChange = function(grid, index, value){
		console.log("rgchange", value);
		if(value instanceof Date)
			value = new Date(value).rgformat("yyyy/MM/dd");
		var $elt = _rg.getBoundElt();
		$elt.val(value);
	}
	
	var onKeyDown = function(grid, key, ctrl, shift, alt){
		var index = getFocusIndex();
		_rg.oldItemState = grid.getItemState(index.itemIndex);
	}
	
	var onKeyUp = function(grid, key, ctrl, shift, alt){
		var index = getFocusIndex();
		if(key == 27){
			var newItemState = grid.getItemState(index.itemIndex);
			if((newItemState == "focused") && (_rg.oldItemState == "updating")){
				fillAllEltsVal(grid, index.dataRow);
			}
		}
	}
	
	//////public function //////
	// cellindex
	var getFocusIndex = function(){
		return _rg.focusIndex;
	}
	
	var setFocusIndex = function(index){
		_rg.focusIndex = index;
	}
	
	//현재 선택중인 셀의 엘리먼트 지정
	var setBoundElt = function(index){
		var elts = _rg.getFormElts();
		_rg.boundElt = $.map(elts, function(attr){
			var field = $(attr).attr("rgField");
			if(field == index.fieldName){
				return attr;
			}
		});
	}
	
	var getBoundElt = function(){
		return $(_rg.boundElt);
	}
	
	var getFormElts = function(){
		return _rg.formElts;
	}
	
	var clearEltsVal = function(){
		var elts = _rg.getFormElts();
		$.each(elts, function(k,v){
			if(v.type == "checkbox"){
				$(v)[0].checked = false;
			}else
				$(v).val(undefined);
		});
	}
	
	//행 이동시 엘리먼트 전체에 값 설정
	var fillAllEltsVal = function(grid, dataRow){
		if(dataRow < 0){
			clearEltsVal();
			return;
		}
		var elts = _rg.getFormElts();
		var vals = _gvdp._dp.getOutputRow(_gvdp._options._dateFormat,dataRow);
		$.each(elts, function(index, elt){
			var field = $(elt).attr("rgField");
			var col = grid.columnByField(field);
			var renderer = grid.getColumnProperty(col, "renderer");
			if(renderer && renderer.type === "check"){
				if(renderer.trueValues == vals[field]){
					elt.checked = true;
				}else{
					elt.checked = false;
				}
			}else
				elt.value = vals[field] ? vals[field] : "";
		});
	}
	
	//필드명으로 엘리먼트 찾기
	var eltByField = function(fieldName){
		var elts = _rg.getFormElts();
		for(var i=0; i < elts.length; i++){
			var elt = elts[i];
			if(fieldName === $(elt).attr("rgField")){
				return elt;
			}
		}
		return null;
	}
	
	return {
		bindForm : bindForm,
		onCurrentRowChanged : onCurrentRowChanged,
		onCurrentChanging : onCurrentChanging,
		onEditChange : onEditChange, 
		onEditCanceled : onEditCanceled, 
		onEditRowChanged : onEditRowChanged, 
		onKeyDown : onKeyDown, 
		onKeyUp : onKeyUp, 
		getFocusIndex : getFocusIndex,
		setFocusIndex : setFocusIndex,
		setBoundElt : setBoundElt,
		getBoundElt : getBoundElt,
		getFormElts : getFormElts,
		eltByField : eltByField,
		fillAllEltsVal : fillAllEltsVal,
		clearEltsVal : clearEltsVal
	}
};

//-------date format util	
// date형식으로 이벤트 함수에 넘어온 값의 포멧을 지정하기 위한 코드
String.prototype.rgstr = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.rgzf = function(len){return "0".rgstr(len - this.length) + this;};
Number.prototype.rgzf = function(len){return this.toString().rgzf(len);};
Date.prototype.rgformat = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).rgzf(2);
            case "dd": return d.getDate().rgzf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().rgzf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().rgzf(2);
            case "ss": return d.getSeconds().rgzf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
//-------date end