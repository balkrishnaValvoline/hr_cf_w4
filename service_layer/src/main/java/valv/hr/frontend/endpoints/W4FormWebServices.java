package valv.hr.frontend.endpoints;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.json.JSONArray;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.cloud.security.token.AccessToken;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoStructure;
import com.sap.conn.jco.JCoTable;

import valv.hr.connectivity.jco.FunctionExecution;
import valv.hr.connectivity.rfc.importParams.models.NEW_P0210_US;
import valv.hr.connectivity.rfc.importParams.models.READ_P0210_US;
import valv.hr.connectivity.rfc.importParams.models.SAVE_P0210_US;
import valv.hr.connectivity.rfc.structures.F4VALUE;
import valv.hr.connectivity.rfc.structures.PI_RECORD;
import valv.hr.connectivity.rfc.structures.PO_ADDRESS;
import valv.hr.connectivity.rfc.structures.PO_MESSAGES;
import valv.hr.connectivity.rfc.structures.PO_PERSONAL_DATA;
import valv.hr.security.AuthenticationHelper;
import valv.hr.security.HRUser;
import valv.hr.security.UserManagement;
import valv.hr.service.execution.W4ServiceHelper;
import valv.hr.utility.AppConstants;
import valv.hr.utility.MESSAGE_PROCESS_OBJ;

@Path("/w4")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class W4FormWebServices {

	private static final Logger logger = LoggerFactory.getLogger(W4FormWebServices.class);

	@Inject
	UserManagement userMgmt;

	@GET
	@Path("/userToken")
	public String getUserToken(@Context HttpServletRequest request) {
		AccessToken userToken = (AccessToken) request.getUserPrincipal();
		return userToken.getTokenValue();
	}

	@Inject
	FunctionExecution funcExec;

	@GET
	@Path("/test")
	public Response userLogin(@Context HttpServletRequest request) throws URISyntaxException {

		HRUser user = AuthenticationHelper.getInstance().getAuthenticatedUser(request);
		String userId = user.getUserId();
		Map<String, Object> importParam = new HashMap<String, Object>();
		importParam.put("USERNAME", userId);
		importParam.put("VALIDBEGIN", new Date());
		JCoFunction func = funcExec.executeRFC(AppConstants.RFC_NAME_AUTH_CHECK, importParam);

		JCoParameterList exportParam = func.getExportParameterList();

		return Response.ok().entity(exportParam.toJSON()).build();
	}

	/**
	 * User Login Service
	 * @param request
	 * @return
	 * @throws URISyntaxException
	 */
	@GET
	@Path("/loginSvc")
	public Response loginService(@Context HttpServletRequest request) throws URISyntaxException {

		logger.trace("[ENTER] loginService");

		HRUser user = AuthenticationHelper.getInstance().getAuthenticatedUser(request);
		Map<String, String> logonData = new HashMap<>();
		logonData.put("USERID", user.getUserId());
		logonData.put("EMPLNO", request.getAttribute("PERNR").toString());
		logonData.put("FNAME", user.getFirstName());
		logonData.put("LNAME", user.getLastName());
		return Response.ok().entity(logonData).build();
	}
	
	/**
	 * Logout Service
	 * @param request
	 * @return
	 * @throws URISyntaxException
	 */
	@GET
	@Path("/userLogout")
	public ResponseBuilder logOutUser(@Context HttpServletRequest request) throws URISyntaxException {
		logger.info("[ENTER] logout Service");
		System.out.println("[ENTER] logout Service");
		HttpSession session = request.getSession(false);
		if(session !=null) {
			if(session.getAttribute("IM_USER") !=null) {
				logger.info("User Session : {}", ((HRUser) session.getAttribute("HR_USER")).toString());
			}
			session.removeAttribute("IM_USER");
			logger.info("Removed User Session : {}",session.getAttribute("HR_USER"));
		}
		return Response.ok().location(new URI(request.getRequestURI()));
	}

	@Inject
	W4ServiceHelper w4SvcHelper;

	/**
	 * Web Request to get all the Fed Records
	 * 
	 * @param request
	 * @return
	 * @throws IntrospectionException
	 * @throws InvocationTargetException
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws JsonProcessingException
	 * @throws JsonMappingException
	 */

	@GET
	@Path("/fedRecords")
	public Response getRecords(@Context HttpServletRequest request)
		throws IllegalAccessException,
			IllegalArgumentException,
			InvocationTargetException,
			IntrospectionException,
			JsonMappingException,
			JsonProcessingException
	{

		logger.trace("[ENTER] getRecords");
		String userId = AuthenticationHelper.getInstance().getAuthenticatedUser(request).getUserId();
		READ_P0210_US readImportParam = new READ_P0210_US();
		readImportParam.setPI_EFF_DATE(new Date());
		readImportParam.setPI_EMP_LID(userId);

		Map<String, Object> importParams = null;
		importParams = w4SvcHelper.setImportParameters(readImportParam);
		JCoFunction readFunc = funcExec.executeRFC(AppConstants.RFC_NAME_READ, importParams);

		if (readFunc != null) {
			/*
			 * Check PO_MESSAGES for TYPE = 'A' or 'E'
			 */
			MESSAGE_PROCESS_OBJ msgObj = null;
			JCoTable po_messages = readFunc.getExportParameterList().getTable("PO_MESSAGES");
			msgObj = this.processMessages(po_messages);
			if (msgObj.isErrorFlag()) {
				return Response.ok().entity(msgObj.getPoMessages()).build();
			}
			/*
			 * Return W4 Data
			 */
			List<PI_RECORD> w4Records = new ArrayList<PI_RECORD>();
			JCoTable w4Data = readFunc.getExportParameterList().getTable("PO_W4_DATA");
			if (!w4Data.isEmpty()) {
				w4Data.firstRow();
				ObjectMapper mapper = new ObjectMapper();
				do {
					PI_RECORD record = mapper.readValue(
						new JSONArray(w4Data.toJSON()).getJSONObject(w4Data.getRow()).toString(), PI_RECORD.class);
					w4Records.add(record);
				} while (w4Data.nextRow());

			}
			return Response.ok().entity(w4Records).build();

		} else {
			return Response.serverError().build();
		}

	}

	/**
	 * Service Method to create new w4
	 * 
	 * @param request
	 * @return
	 * @throws JsonMappingException
	 * @throws JsonProcessingException
	 * @throws JSONException
	 */
	@GET
	@Path("/createNew")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createNewRecord(@Context HttpServletRequest request)
		throws JsonMappingException,
			JsonProcessingException,
			JSONException
	{

		logger.trace("ENTER createNewRecord");
		String pernr = request.getAttribute("PERNR").toString();

		NEW_P0210_US newRecParams = new NEW_P0210_US();
		newRecParams.setPI_PERNR(pernr);
		newRecParams.setPI_EFF_DATE(new Date());

		Map<String, Object> importParams = null;
		try {
			importParams = w4SvcHelper.setImportParameters(newRecParams);
		} catch (
			IllegalAccessException
				| IllegalArgumentException
				| InvocationTargetException
				| IntrospectionException e)
		{
			e.printStackTrace();
		}

		JCoFunction newRecOut = funcExec.executeRFC(AppConstants.RFC_NAME_NEW, importParams);
		Map<String, Object> newW4RetObj = new HashMap<>();
		if (newRecOut != null) {
			ObjectMapper mapper = new ObjectMapper();
			JCoParameterList outputParams = newRecOut.getExportParameterList();

			// Check RFC Messages
			MESSAGE_PROCESS_OBJ msgObj = null;
			JCoTable po_messages = outputParams.getTable("PO_MESSAGES");
			msgObj = this.processMessages(po_messages);
			if (msgObj.isErrorFlag()) {
				return Response.ok().entity(msgObj.getPoMessages()).build();
			}

			// W4 Data Object
			JCoStructure w4Data = outputParams.getStructure("PO_W4_DATA");
			PI_RECORD w4Record = mapper.readValue(w4Data.toJSON(), PI_RECORD.class);

			// Address Data
			JCoStructure addressDate = outputParams.getStructure("PO_ADDRESS_DATA");
			PO_ADDRESS addRec = mapper.readValue(addressDate.toJSON(), PO_ADDRESS.class);

			// Personal Data
			JCoStructure personalData = outputParams.getStructure("PO_PERSONAL_DATA");
			PO_PERSONAL_DATA perRec = mapper.readValue(personalData.toJSON(), PO_PERSONAL_DATA.class);

			newW4RetObj.put("W4_DATA", w4Record);
			newW4RetObj.put("ADDRS_DATA", addRec);
			newW4RetObj.put("PERS_DATA", perRec);
			newW4RetObj.put("F4_HELP", this.processF4Help(outputParams.getTable("PO_F4_VALUES")));

			newW4RetObj.put("MESSAGES", msgObj.getPoMessages());
			return Response.ok().entity(newW4RetObj).build();
		} else {
			return Response.serverError().build();
		}
	}

	/**
	 * Service method to edit w4 record
	 * 
	 * @param request
	 * @param w4Input
	 * @return
	 * @throws JsonMappingException
	 * @throws JsonProcessingException
	 * @throws JSONException
	 */
	@POST
	@Path("/editRecord")
	public Response editRecord(@Context HttpServlet request, PI_RECORD w4Input)
		throws JsonMappingException,
			JsonProcessingException,
			JSONException
	{
		logger.trace("ENTER editRecord");

		Map<String, Object> importParams = null;
		try {
			importParams = w4SvcHelper.setImportParameters(w4Input);
		} catch (
			IllegalAccessException
				| IllegalArgumentException
				| InvocationTargetException
				| IntrospectionException e)
		{
			e.printStackTrace();
		}

		JCoFunction editResponse = funcExec.executeEditDelete(AppConstants.RFC_NAME_EDIT, importParams);
		Map<String, Object> editW4RetObj = new HashMap<>();
		if (editResponse != null) {
			ObjectMapper mapper = new ObjectMapper();
			JCoParameterList outputParams = editResponse.getExportParameterList();

			// Check RFC Messages
			MESSAGE_PROCESS_OBJ msgObj = null;
			JCoTable po_messages = outputParams.getTable("PO_MESSAGES");
			msgObj = this.processMessages(po_messages);
			if (msgObj.isErrorFlag()) {
				return Response.ok().entity(msgObj.getPoMessages()).build();
			}

			// Address Data
			JCoStructure addressDate = outputParams.getStructure("PO_ADDRESS_DATA");
			PO_ADDRESS addRec = mapper.readValue(addressDate.toJSON(), PO_ADDRESS.class);

			// Personal Data
			JCoStructure personalData = outputParams.getStructure("PO_PERSONAL_DATA");
			PO_PERSONAL_DATA perRec = mapper.readValue(personalData.toJSON(), PO_PERSONAL_DATA.class);

			editW4RetObj.put("TXSTA_NEW", outputParams.getValue("PO_TXSTA_NEW").toString());
			editW4RetObj.put("ADDRS_DATA", addRec);
			editW4RetObj.put("PERS_DATA", perRec);
			editW4RetObj.put("F4_HELP", this.processF4Help(outputParams.getTable("PO_F4_VALUES")));

			editW4RetObj.put("MESSAGES", msgObj.getPoMessages());
			return Response.ok().entity(editW4RetObj).build();
		} else {
			return Response.serverError().build();
		}
	}

	/**
	 * Service method to save w4 record
	 * 
	 * @param request
	 * @param saveInput
	 * @return
	 * @throws JsonMappingException
	 * @throws JsonProcessingException
	 * @throws JSONException
	 */
	@POST
	@Path("/saveRecord")
	public Response saveRecord(@Context HttpServlet request, SAVE_P0210_US saveInput)
		throws JsonMappingException,
			JsonProcessingException,
			JSONException
	{
		logger.trace("ENTER saveRecord");
		Map<String, Object> importParamOldRec = null;
		Map<String, Object> importParamNewRec = null;
		try {
			importParamOldRec = w4SvcHelper.setImportParameters(saveInput.getOLD_RECORD());
			importParamNewRec = w4SvcHelper.setImportParameters(saveInput.getNEW_RECORD());
		} catch (
			IllegalAccessException
				| IllegalArgumentException
				| InvocationTargetException
				| IntrospectionException e)
		{
			e.printStackTrace();
		}

		JCoFunction saveResponse =
			funcExec.executeSave(AppConstants.RFC_NAME_SAVE, importParamOldRec, importParamNewRec);
		Map<String, Object> editW4RetObj = new HashMap<>();
		if (saveResponse != null) {
			JCoParameterList outputParams = saveResponse.getExportParameterList();

			// Check RFC Messages
			MESSAGE_PROCESS_OBJ msgObj = null;
			JCoTable po_messages = outputParams.getTable("PO_MESSAGES");
			msgObj = this.processMessages(po_messages);
			if (msgObj.isErrorFlag()) {
				return Response.ok().entity(msgObj.getPoMessages()).build();
			}
			editW4RetObj.put("MESSAGES", msgObj.getPoMessages());
			return Response.ok().entity(editW4RetObj).build();
		} else {
			return Response.serverError().build();
		}
	}

	@POST
	@Path("/deleteRecord")
	public Response deleteRecord(@Context HttpServletRequest request, PI_RECORD delRecord)
		throws JsonMappingException,
			JsonProcessingException,
			JSONException
	{
		logger.trace("ENTER deleteRecord");
		Map<String, Object> importParams = null;
		try {
			importParams = w4SvcHelper.setImportParameters(delRecord);
		} catch (
			IllegalAccessException
				| IllegalArgumentException
				| InvocationTargetException
				| IntrospectionException e)
		{
			e.printStackTrace();
		}

		JCoFunction delResponse = funcExec.executeEditDelete(AppConstants.RFC_NAME_DELETE, importParams);
		Map<String, Object> delW4RetObj = new HashMap<>();
		if (delResponse != null) {
			JCoParameterList outputParams = delResponse.getExportParameterList();

			// Check RFC Messages
			MESSAGE_PROCESS_OBJ msgObj = null;
			JCoTable po_messages = outputParams.getTable("PO_MESSAGES");
			msgObj = this.processMessages(po_messages);
			if (msgObj.isErrorFlag()) {
				return Response.ok().entity(msgObj.getPoMessages()).build();
			}

			delW4RetObj.put("MESSAGES", msgObj.getPoMessages());
			return Response.ok().entity(delW4RetObj).build();
		} else {
			return Response.serverError().build();
		}
	}

	/**
	 * Process F4Help Table Object
	 * 
	 * @param f4Help
	 * @return
	 * @throws JsonProcessingException
	 * @throws JsonMappingException
	 */
	private Map<String, Object> processF4Help(JCoTable f4Help) throws JsonMappingException, JsonProcessingException {
		Map<String, Object> obj = new HashMap<>();
		ObjectMapper mapper = new ObjectMapper();
		f4Help.firstRow();
		do {
			String fieldName = f4Help.getValue("FIELDNAME").toString();

			if (fieldName.equals("TXSTA") || fieldName.equals("EXIND")) {
				JCoTable valueTable = f4Help.getTable("F4VALUES");
				List<F4VALUE> valueList = new ArrayList<>();
				valueTable.firstRow();
				do {
					valueList.add(mapper.readValue(
						new JSONArray(valueTable.toJSON()).getJSONObject(valueTable.getRow()).toString(),
						F4VALUE.class));
				} while (valueTable.nextRow());
				obj.put(fieldName, valueList);
			}

		} while (f4Help.nextRow());

		return obj;
	}

	/**
	 * Method to club RFC Messages into a List
	 * 
	 * @param po_messages
	 * @return {@link MESSAGE_PROCESS_OBJ}
	 */
	private MESSAGE_PROCESS_OBJ processMessages(JCoTable po_messages) {
		MESSAGE_PROCESS_OBJ retObj = new MESSAGE_PROCESS_OBJ();

		if (!po_messages.isEmpty()) {
			List<PO_MESSAGES> messagesList = new ArrayList<>();
			List<PO_MESSAGES> errorMessages = new ArrayList<>();

			ObjectMapper mapper = new ObjectMapper();
			po_messages.firstRow();
			do {
				try {
					/*
					 * Check for TYPE = 'A' and 'E' messages which signifies error
					 * 
					 */
					if (po_messages.getString("TYPE").equals("A") || po_messages.getString("TYPE").equals("E")) {
						PO_MESSAGES msg = mapper.readValue(
							new JSONArray(po_messages.toJSON()).getJSONObject(po_messages.getRow()).toString(),
							PO_MESSAGES.class);
						retObj.setErrorFlag(true);
						errorMessages.add(msg);
						
					} else if (!retObj.isErrorFlag()) { // Check if Type = 'A' or 'E' message are already found
						
						PO_MESSAGES msg = mapper.readValue(
							new JSONArray(po_messages.toJSON()).getJSONObject(po_messages.getRow()).toString(),
							PO_MESSAGES.class);
						messagesList.add(msg);
						
					}
				} catch (JsonProcessingException | JSONException e) {
					e.printStackTrace();
				}
			} while (po_messages.nextRow());

			if (retObj.isErrorFlag()) {
				retObj.setPoMessages(errorMessages);
			} else {
				retObj.setPoMessages(messagesList);
			}
		}
		return retObj;
	}

}
