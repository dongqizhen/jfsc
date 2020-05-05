<%@ page language="java" contentType="text/html; charset=UTF-8"
	import="com.baidu.ueditor.ActionEnter"
    pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%

	//原有代码
    request.setCharacterEncoding( "utf-8" );
	response.setHeader("Content-Type" , "text/html");
	response.setHeader("Access-Control-Allow-Origin" , "*");
	response.setHeader("Access-Control-Allow-Headers" , "X-Requested-With,X_Requested_With");
	String rootPath = application.getRealPath( "/" );
	String result = new ActionEnter( request, rootPath ).exec();
	
	//手动增加
	String action = request.getParameter("action");
	String callUrl = request.getParameter("callUrl");
	if(callUrl!=null && callUrl!=""){
		if(action.equals("uploadimage") || 
				action.equals("uploadscrawl") || 
				action.equals("catchimage") || 
				action.equals("uploadvideo") || 
				action.equals("uploadfile") || 
				action.equals("listimage") || 
				action.equals("listfile")){
	        callUrl = callUrl + "?result=" + java.net.URLEncoder.encode(result, "utf-8");
	        response.sendRedirect(callUrl);
		}else{
			out.write( result );
		}
	}
	else{
		out.write( result );
	}
	
%>