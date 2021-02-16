package valv.hr.utility;

/**
 * @author A535396
 *
 */
/**
 * @author A535396
 *
 */
public class AppConstants {
	
	public static final String HEADER_PROXY_AUTHORIZATION = "Proxy-Authorization";
	public static final String HEADER_SCC_LOCATION_ID = "SAP-Connectivity-SCC-Location_ID";
	public static final String HEADER_SAP_CONNECTIVITY_AUTHENTICATION = "SAP-Connectivity-Authentication";
	public static final String HEADER_AUTHORIZATION = "Authorization";

	public static final int CONNECT_TIMEOUT = 10000;
	public static final int READ_TIMEOUT = 60000;
	
	public static final String BEARER_WITH_TRAILING_SPACE = "Bearer ";
	public static final String BASIC_WITH_TRAILING_SPACE = "Basic ";

	public static final String HTTP = "http://";
	public static final String HTTPS = "https://";

	public static final String PARAM_HTTP_CLIENT = "HttpClient"; // A form element, used when reading from the HTML form
	
	// System Client 020 (VQH) , 130 (VDH)
	public static final String SYSTEM_CLIENT = "130";
	
	/*
	 * Connectivity Service 
	 */
	
	public static final String ONPREM_PROXY_HOST = "onpremise_proxy_host";
	public static final String ONPREM_PROXY_PORT = "onpremise_proxy_http_port";
	
	/*
	 * 
	 * Service Instances
	 */
	
	public static final String XSUAA_SVC_INSTANCE = "hr_xsuaa";
	public static final String DESTINATION_SVC_INSTANCE = "hr_destinations";
	public static final String CONNECTIVITY_SVC_INSTANCE = "hr_connectivity";
	
	
	/**
	 * HR Destination
	 */
	public static final String RFC_DEST_NAME = "HR_RFC_SNC";
	
	/**
	 * Function to Authorise User - Check for NON-US User
	 */
	public static final String RFC_NAME_AUTH_CHECK = "RHXSS_SER_GET_EMPLOYEE_DATA";
	
	/**
	 * Function to READ W4
	 */
	public static final String RFC_NAME_READ = "Z_USHRM_ESS_READ_P0210_US";
	
	/**
	 * Function to CREATE NEW Tax Record
	 */
	public static final String RFC_NAME_NEW = "Z_USHRM_ESS_NEW_P0210_US";
	
	/**
	 * Function to SAVE
	 */
	public static final String RFC_NAME_SAVE = "Z_USHRM_ESS_SAVE_P0210_US";
	
	/**
	 * Function to EDIT Record
	 */
	public static final String RFC_NAME_EDIT = "Z_USHRM_ESS_EDIT_P0210_US";
	
	/**
	 * Function to DELETE Record
	 */
	public static final String RFC_NAME_DELETE = "Z_USHRM_ESS_DELETE_P0210_US";

}
