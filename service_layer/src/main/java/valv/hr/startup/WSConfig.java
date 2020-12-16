package valv.hr.startup;

import javax.ws.rs.ApplicationPath;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import valv.hr.connectivity.jco.FunctionExecution;
import valv.hr.security.ContentFilter;
import valv.hr.security.UserManagement;
import valv.hr.service.execution.W4ServiceHelper;

@ApplicationPath("/hrservices")
public class WSConfig extends ResourceConfig{
	
	private static final Logger logger = LoggerFactory.getLogger(WSConfig.class);
	
	public WSConfig() {
		logger.info("[ENTER] WSConfig Constructor");
		register(ContentFilter.class);
		packages("valv.hr.frontend.endpoints","valv.hr.dev.admin");
		register(new DependencyBinder());
	}
	
	static class DependencyBinder extends AbstractBinder{

		@Override
		protected void configure() {
			bindAsContract(UserManagement.class);
			bindAsContract(FunctionExecution.class);
			bindAsContract(W4ServiceHelper.class);
		}
		
	}
}
