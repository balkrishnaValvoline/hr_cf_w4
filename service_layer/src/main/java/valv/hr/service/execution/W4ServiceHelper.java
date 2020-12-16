package valv.hr.service.execution;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.BeanPropertyDefinition;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoTable;

import valv.hr.connectivity.jco.FunctionExecution;
import valv.hr.connectivity.rfc.importParams.models.READ_P0210_US;
import valv.hr.connectivity.rfc.structures.PI_RECORD;
import valv.hr.utility.AppConstants;

public class W4ServiceHelper {
	
	private static final Logger logger = LoggerFactory.getLogger(W4ServiceHelper.class);
	
	@Inject
	FunctionExecution funcExecutor;
	
	
	/**
	 * Method to create Map of import parameters to be passed to the RFC
	 * 
	 * @param classObj 
	 * @return {@link Map}
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws InvocationTargetException
	 * @throws IntrospectionException
	 */
	public Map<String, Object> setImportParameters(Object classObj) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, IntrospectionException {
	
		ObjectMapper objMapper = new ObjectMapper();
		JavaType javaType = objMapper.getTypeFactory().constructType(classObj.getClass());
		
		BeanDescription beanDesc = objMapper.getSerializationConfig().introspect(javaType);
		
		// Find properties
		List<BeanPropertyDefinition> properties = beanDesc.findProperties();
		Map<String, Object> paramsMap = new HashMap<String, Object>();
		for (BeanPropertyDefinition property : properties) {
			paramsMap.put(property.getName(), this.invokeGetter(classObj, property.getName()));
		}
		return paramsMap;
	}
	
	/**
	 * Method to invoke getter function of the given property
	 * 
	 * @param classObj
	 * @param propName
	 * @return
	 * @throws IntrospectionException
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws InvocationTargetException
	 */
	public Object invokeGetter(Object classObj, String propName) throws IntrospectionException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		PropertyDescriptor propDesc = new PropertyDescriptor(propName, classObj.getClass());
		Method getterMethod = propDesc.getReadMethod();
		return getterMethod.invoke(classObj);
	}

}
