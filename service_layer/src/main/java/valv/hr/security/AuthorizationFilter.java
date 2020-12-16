package valv.hr.security;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.cloud.security.token.AccessToken;

@WebFilter(urlPatterns = {
	"/*"
})
public class AuthorizationFilter implements Filter{
	private static final Logger logger = LoggerFactory.getLogger(AuthorizationFilter.class);

	@Override
	public void destroy() {
		logger.trace("[AuthorizationFilter] destroy");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
		throws IOException,
			ServletException
	{
		System.out.println("Filter Encountered");
		if(request instanceof HttpServletRequest) {
			HttpServletRequest httpRequest = (HttpServletRequest) request;
			HttpServletResponse httpResponse = (HttpServletResponse) response;
			
			if(isUserAuthorized(httpRequest)) {
				chain.doFilter(httpRequest, httpResponse);
			}else {
				httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			}
		}
		
	}

	private boolean isUserAuthorized(HttpServletRequest httpRequest) {
		logger.trace("[ENTER] isUserAuthorized");
		HRUser hrUser = AuthenticationHelper.getInstance().getAuthenticatedUser(httpRequest);
		String requestUri = httpRequest.getRequestURI().toString();
		if(requestUri.contains("/devadmin")) {
			if(hrUser.getUserId().equalsIgnoreCase("a535396")) {
				logger.trace("[AUTHORIZED] - Dev Admin Service");
				return true;
			}else {
				logger.trace("[UNAUTHORIZED ATTEMPT] - Dev Admin Service : {} ", hrUser.getUserId());
				return false;
			}
		}
		boolean countryCheck = AuthorizationHelper.getInstance().checkCountryAuthorisation(httpRequest,hrUser.getUserId());
		if(countryCheck) {
			return true;
		}
		logger.info("User : {} unauthorized",hrUser.getUserId());
		return false;
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		logger.trace("[AuthorizationFilter] init");
	}

}
