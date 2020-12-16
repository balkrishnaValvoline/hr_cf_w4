package valv.hr.startup;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebListener
public class AppInitializer implements ServletContextListener{
	
	private static final Logger logger = LoggerFactory.getLogger(AppInitializer.class);

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		logger.info("[App Context Destroyed]");
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		logger.info("[App Context Intialized]");
	}

}
