package valv.hr.security;

import java.io.IOException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;

public class ContentFilter implements ContainerResponseFilter{
	public void filter(ContainerRequestContext req, ContainerResponseContext resp) throws IOException {
		resp.getHeaders().add("Access-Control-Allow-Origin", "*");
		resp.getHeaders().add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization, x-csrf-token");
		resp.getHeaders().add("Access-Control-Allow-Credentials", "true");
		resp.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
		
	}
}
