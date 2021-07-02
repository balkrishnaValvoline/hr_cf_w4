package valv.hr.dev.admin;

import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.sap.cloud.security.token.AccessToken;
import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoField;
import com.sap.conn.jco.JCoFieldIterator;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoStructure;
import com.sap.conn.jco.JCoTable;

import valv.hr.connectivity.jco.FunctionExecution;
import valv.hr.security.AuthenticationHelper;
import valv.hr.security.HRUser;
import valv.hr.security.UserManagement;
import valv.hr.utility.AppConstants;

@Path("/devadmin")
@Produces(MediaType.APPLICATION_JSON)
public class DevAdmin {

	@Inject
	UserManagement userMgmt;


	@Inject
	FunctionExecution funcExec;
	
	
	@GET
	@Path("/testServerDate")
	public String testServerDate(@Context HttpServletRequest request) {
		Date dt = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd G 'at' HH:mm:ss z");
		return sdf.format(dt);
	}
	
	@GET
	@Path("/userToken")
	public String getUserToken(@Context HttpServletRequest request) {
		AccessToken token = (AccessToken) request.getUserPrincipal();
		return token.getTokenValue();
	}
	
	@GET
	@Path("/test")
	public Response userLogin(@Context HttpServletRequest request) throws URISyntaxException {
		request.setAttribute("attr", "Test Successful");

		HRUser user = AuthenticationHelper.getInstance().getAuthenticatedUser(request);
		String userId = user.getUserId();
		Map<String, Object> importParam = new HashMap<String, Object>();
		importParam.put("USERNAME", userId);
		importParam.put("VALIDBEGIN", new Date());
		JCoFunction func = funcExec.executeRFC(AppConstants.RFC_NAME_AUTH_CHECK, importParam);

		JCoParameterList exportParam = func.getExportParameterList();

		return Response.ok().entity(exportParam.toJSON()).build();
	}


	@GET
	@Path("/getImportParamTypes/{rfcName}")
	public Response getImportParamTypes(@Context HttpServletRequest request, @PathParam("rfcName") String rfcName)
		throws JCoException
	{
		JCoDestination dest = JCoDestinationManager.getDestination(AppConstants.RFC_DEST_NAME);

		JCoFunction func = dest.getRepository().getFunction(rfcName);
		JCoParameterList params = func.getImportParameterList();
		Map<String, String> paramTypes = new HashMap<>();
		for (JCoField jCoField : params) {
			paramTypes.put(jCoField.getName(), jCoField.getTypeAsString());
		}
		return Response.ok().entity(paramTypes).build();
	}

	@GET
	@Path("/getExportParamTypes/{rfcName}")
	public Response getExportParamTypes(@Context HttpServletRequest request, @PathParam("rfcName") String rfcName)
		throws JCoException
	{
		JCoDestination dest = JCoDestinationManager.getDestination(AppConstants.RFC_DEST_NAME);

		JCoFunction func = dest.getRepository().getFunction(rfcName);
		JCoParameterList params = func.getExportParameterList();
		Map<String, String> paramTypes = new HashMap<>();
		for (JCoField jCoField : params) {
			paramTypes.put(jCoField.getName(), jCoField.getTypeAsString());
		}
		return Response.ok().entity(paramTypes).build();
	}

	@GET
	@Path("/accessStructure/{rfcName}/{paramType}/{structureName}")
	public Response getStructure(
		@Context HttpServletRequest request,
			@PathParam("rfcName") String rfcName,
			@PathParam("paramType") String paramType,
			@PathParam("structureName") String structName) throws JCoException
	{
		
		JCoDestination dest = JCoDestinationManager.getDestination(AppConstants.RFC_DEST_NAME);
		JCoFunction func = dest.getRepository().getFunction(rfcName);
		JCoParameterList params = null;
		if(paramType.equals("import")) {
			params = func.getImportParameterList();
		}else if(paramType.equals("export")) {
			params = func.getExportParameterList();
		}
		
		JCoStructure struct = params.getStructure(structName);
		JCoFieldIterator structIter = struct.getFieldIterator();
		
		Map<String, String> structureTypes = new HashMap<>();
		while(structIter.hasNextField()) {
			JCoField field = structIter.nextField();
			structureTypes.put(field.getName(), field.getTypeAsString());
		}
		
		return Response.ok().entity(structureTypes).build();
	}
	
	@GET
	@Path("/accessTable/{rfcName}/{paramType}/{tableName}")
	public Response getTable(
		@Context HttpServletRequest request,
			@PathParam("rfcName") String rfcName,
			@PathParam("paramType") String paramType,
			@PathParam("tableName") String tableName) throws JCoException
	{
		
		JCoDestination dest = JCoDestinationManager.getDestination(AppConstants.RFC_DEST_NAME);
		JCoFunction func = dest.getRepository().getFunction(rfcName);
		JCoParameterList params = null;
		if(paramType.equals("import")) {
			params = func.getImportParameterList();
		}else if(paramType.equals("export")) {
			params = func.getExportParameterList();
		}
		
		JCoTable table = params.getTable(tableName);
		JCoFieldIterator tableIter = table.getFieldIterator();
		
		Map<String, String> tableType = new HashMap<>();
		while(tableIter.hasNextField()) {
			JCoField field = tableIter.nextField();
			tableType.put(field.getName(), field.getTypeAsString());
		}
		
		return Response.ok().entity(tableType).build();
	}
	
}
