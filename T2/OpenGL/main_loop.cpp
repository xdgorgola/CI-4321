#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <iostream>
#include <string>

// Boiler plate to compile a shader
int compileShader(unsigned int shader, GLenum type, const char* src);
// Boiler plate to link a shader
int linkShaders(unsigned int vertexShader, unsigned int fragmentShader, unsigned int& program);
// Window resize handler
void windowResizeCallback(GLFWwindow* window, int width, int height);
// Input processing
void processInput(GLFWwindow* window);

int main()
{
	// Window initializantion
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	GLFWwindow* window = glfwCreateWindow(800, 600, "OpenGL Triangle", NULL, NULL);
	if (window == NULL)
	{
		glfwTerminate();
		return -1;
	}

	glfwMakeContextCurrent(window);
	glfwSetFramebufferSizeCallback(window, windowResizeCallback);

	// Glad initialization for buffer~memory handling.
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		glfwTerminate();
		return -1;
	}

	int success;
	// Shaders source
	const char* vertexShaderSource =
		"#version 330 core\n"
		"layout (location = 0) in vec3 aPos;\n"
		"layout (location = 1) in vec3 aCol;\n"
		"out vec3 vertexColor;\n"
		"void main()\n"
		"{\n"
		"   gl_Position = vec4(aPos, 1.0);\n"
		"   vertexColor = aCol;\n"
		"}\0";

	const char* fragmentShaderSource =
		"#version 330 core\n"
		"out vec4 FragColor;\n"
		"in vec3 vertexColor;\n"
		"void main()\n"
		"{\n"
		"   FragColor = vec4(vertexColor, 1.0);\n"
		"}\0";

	// Shader compilation
	unsigned int vertexShader;
	unsigned int fragmentShader;
	vertexShader = glCreateShader(GL_VERTEX_SHADER);
	fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);

	success = compileShader(vertexShader, GL_VERTEX_SHADER, vertexShaderSource);
	if (!success)
	{
		glfwTerminate();
		return 1;
	}

	success = compileShader(fragmentShader, GL_FRAGMENT_SHADER, fragmentShaderSource);
	if (!success)
	{
		glfwTerminate();
		return 1;
	}

	// Shader linking
	unsigned int shaderProgram;
	success = linkShaders(vertexShader, fragmentShader, shaderProgram);
	if (!success)
	{
		glfwTerminate();
		return 1;
	}

	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);


	// Shader attributes
	float vert_attribs[] = {
		// Positions        // Colors
		-0.5f, -0.5f,  0.0f,  0.0f, 1.0f, 0.0f,
		 0.0f,  0.87f, 0.0f,  1.0f, 0.0f, 0.0f,
		 0.5f, -0.5f,  0.0f,  0.0f, 0.0f, 1.0f
	};

	// Buffers creation and binding
	unsigned int VBO;
	unsigned int VAO;
	glGenBuffers(1, &VBO);
	glGenVertexArrays(1, &VAO);
	glBindVertexArray(VAO);

	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vert_attribs), vert_attribs, GL_STATIC_DRAW);

	// Position buffer data
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);
	// Color buffer data
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)(3 * sizeof(float)));
	glEnableVertexAttribArray(1);

	
	// Main loop!
	while (!glfwWindowShouldClose(window))
	{
		processInput(window);

		glClearColor(0.106f, 0.118f, 0.169f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		glUseProgram(shaderProgram);
		glBindVertexArray(VAO);
		glDrawArrays(GL_TRIANGLES, 0, 3);

		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	glfwTerminate();
	return 0;
}


int compileShader(unsigned int shader, GLenum type, const char* src)
{
	int status;
	char log[512];
	glShaderSource(shader, 1, &src, NULL);
	glCompileShader(shader);
	glGetShaderiv(shader, GL_COMPILE_STATUS, &status);
	if (!status)
	{
		std::string typeStr;
		switch (type)
		{
		case GL_VERTEX_SHADER:
			typeStr = "VERTEX";
			break;
		case GL_FRAGMENT_SHADER:
			typeStr = "FRAGMENT";
			break;
		default:
			break;
		}
		glGetShaderInfoLog(shader, 512, NULL, log);
		std::cout << "ERROR::SHADER::" << typeStr << "::COMPILATION_FAILED\n" << log << std::endl;
	}

	return status;
}


int linkShaders(unsigned int vertexShader, unsigned int fragmentShader, unsigned int& program)
{
	int status;
	char log[512];
	program = glCreateProgram();
	glAttachShader(program, vertexShader);
	glAttachShader(program, fragmentShader);
	glLinkProgram(program);
	glGetProgramiv(program, GL_LINK_STATUS, &status);
	if (!status) {
		glGetProgramInfoLog(program, 512, NULL, log);
		std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n" << log << std::endl;
	}

	return status;
}


void windowResizeCallback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}


void processInput(GLFWwindow* window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
		glfwSetWindowShouldClose(window, true);
}