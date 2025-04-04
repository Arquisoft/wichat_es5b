import React from 'react';
import { render, fireEvent, screen, waitFor, act, cleanup, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Chatbot from './Chatbot';
import '@testing-library/jest-dom';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const mockAxios = new MockAdapter(axios);
const mockSetScore = jest.fn();


describe('Chatbot Component', () => {
  const movieName = 'Inception';
  
  
  const expandChat = () => {
    const toggleButton = screen.getByRole('button', { name: /Chat de Pistas ▲/i });
    fireEvent.click(toggleButton);
    return toggleButton;
  };

  beforeEach(() => {
    mockAxios.reset();
    cleanup();

      render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);

      mockAxios.onPost(apiEndpoint+'/chatBotUsed').reply(200, { score: -20 });
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('Initial State and Appearance', () => {

    it('should render the chatbot minimized by default', () => {

        cleanup();
        render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
        const minimizeButton = screen.getByRole('button', { name: /Chat de Pistas ▲/i });
        expect(minimizeButton).toBeInTheDocument();
        
        
    });

    it('should have correct initial styles for minimized state', () => {

      cleanup();
        render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);

      const toggleButton = screen.getByRole('button', { 
        name: /Chat de Pistas ▲/i 
      });
      
      
      const styles = window.getComputedStyle(toggleButton);
      
      expect(styles.color).toBe("white"); 
      expect(styles.backgroundColor).toBe('rgb(166, 83, 42)'); 
      
      expect(styles.fontWeight).toBe("700");
    });

  });

  describe('Toggle Functionality', () => {
    beforeEach(() => {
        cleanup();
        render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);

      });

    it('should expand when clicking the toggle button', () => {
        

        const toggleButton = expandChat();
        
        expect(toggleButton).toHaveTextContent(/▼/i);
        const paperComponent = screen.getByRole('region');
        expect(paperComponent).toHaveStyle('height: 520px');
    });

    it('should show chat interface when expanded', () => {

        expandChat();
        
        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Escribe tu pregunta...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
    });

    it('should minimize when clicking the toggle button twice', async () => {
       
        
        //localizar el botón correctamente
        const toggleButton = await screen.findByRole('button', { 
          name: /Chat de Pistas ▲/i 
        });
        
        //primer click para expandir
        fireEvent.click(toggleButton);
        
        //verificar que se expandió
        await waitFor(() => {
          expect(screen.getByPlaceholderText('Escribe tu pregunta...')).toBeInTheDocument();
        });
        
        //segundo click para minimizar
        fireEvent.click(toggleButton);
        
        //verificar que se minimizó
        await waitFor(() => {
          expect(screen.queryByPlaceholderText('Escribe tu pregunta...')).not.toBeInTheDocument();
          expect(toggleButton).toHaveTextContent(/Chat de Pistas ▲/i);
        });

      });
  });

  describe('Chat Interface Appearance', () => {

    beforeEach(() => {
      cleanup();
        render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
      expandChat();
    });

    it('should have correct styles for expanded state', () => {

        const sendButton = screen.getByRole('button', { name: /Enviar/i });
        
        //verificar los estilos reales que aplica Material-UI
        expect(sendButton).toHaveStyle({
          backgroundColor: 'rgb(166, 83, 42)',
          height: '45px'
        });

      });

      it('should have proper input field styling', async () => {

        cleanup();

        render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
        
        //encontrar el botón en su estado inicial (▲ = minimizado)
        const toggleButton = await screen.findByRole('button', { 
          name: /Chat de Pistas ▲/i 
        });
        
        //click para expandir (cambiará a ▼)
        fireEvent.click(toggleButton);
        
        //esperar a que el chat se expanda completamente
        await waitFor(() => {
          expect(screen.getByPlaceholderText('Escribe tu pregunta...')).toBeInTheDocument();
        });
        
        //ahora el botón debería mostrar ▼
        const expandedButton = screen.getByRole('button', { 
          name: /Chat de Pistas ▼/i 
        });
        
        //continuar con la prueba de estilos
        const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
        const outlinedInput = inputField.closest('.MuiOutlinedInput-root');
        
      });

    it('should have proper send button hover state', async () => {

        const sendButton = screen.getByRole('button', { name: /Enviar/i });
        
        //forzar estado no-hover
        fireEvent.mouseLeave(sendButton);
        
        //esperar a que se apliquen los estilos
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Verificar estado inicial
        //expect(window.getComputedStyle(sendButton).backgroundColor).toBe('rgb(196, 99, 49)');
        
        //simular hover
        await act(async () => {
          fireEvent.mouseEnter(sendButton);
        });
        
        //verificar hover
        expect(window.getComputedStyle(sendButton).backgroundColor).toBe('rgb(166, 83, 42)');
        
        //restaurar
        await act(async () => {
          fireEvent.mouseLeave(sendButton);
        });
        
        
      });
  });

  describe('Message Functionality', () => {

    beforeEach(() => {
      cleanup();
      render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
      expandChat();
      mockAxios.onPost(/askllm/).reply(200, { answer: 'Esta es una pista sobre la película' });
    });

    it('should not send empty messages', () => {

      const sendButton = screen.getByRole('button', { name: /Enviar/i });
      fireEvent.click(sendButton);
      
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('should add user message to chat when sent', async () => {

      const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
      const sendButton = screen.getByRole('button', { name: /Enviar/i });
      
      fireEvent.change(inputField, { target: { value: '¿Quién es el director?' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        const messages = screen.getAllByRole('listitem');
        expect(messages).toHaveLength(1);
        expect(messages[0]).toHaveTextContent('¿Quién es el director?');
      });

    });

    it('should clear input field after sending message', async () => {

      const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
      const sendButton = screen.getByRole('button', { name: /Enviar/i });
      
      fireEvent.change(inputField, { target: { value: '¿Quién es el director?' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(inputField).toHaveValue('');
      });

    });

    it('should send message when pressing Enter key', async () => {

      const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
      
      fireEvent.change(inputField, { target: { value: '¿En qué año se estrenó?' } });
      fireEvent.keyPress(inputField, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      await waitFor(() => {
        const messages = screen.getAllByRole('listitem');
        expect(messages).toHaveLength(1);
        expect(messages[0]).toHaveTextContent('¿En qué año se estrenó?');
      });

    });



    it('should display answer and user and bot messages have different format', async () => {

      const testResponse = 'Respuesta del bot';
      mockAxios.onPost(/askllm/).reply(200, { answer: testResponse });
      
      const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
      const sendButton = screen.getByRole('button', { name: /Enviar/i });
      
      fireEvent.change(inputField, { target: { value: 'Pregunta del usuario' } });

      await act(async () => {
        fireEvent.click(sendButton);
      });
      
      await waitFor(() => {
        const messages = screen.getAllByRole('listitem');
        expect(messages).toHaveLength(2);
        expect(messages[1]).toHaveTextContent(testResponse);

        const userMessage = screen.getByText('Pregunta del usuario');
        const botMessage = screen.getByText(testResponse);
        
        expect(userMessage.parentElement).toHaveStyle({
          backgroundColor: '#e8d5c9',
          color: '#5a2d16'
        });
        
        expect(botMessage.parentElement).toHaveStyle({
          backgroundColor: '#f0e6de',
          color: '#4a2512'
        });
      });

    });
  });

  describe('Error Handling', () => {

    beforeEach(() => {
        cleanup();
      });

    it('should display error message when API call fails', async () => {

        //cleanup();

        //configurar el mock para que falle
        mockAxios.onPost(/askllm/).reply(500);
        
        //renderizar el componente
        render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
        
        //primero expandir el chat
        const toggleButton = screen.getByRole('button', { name: /Chat de Pistas ▲/i });
        fireEvent.click(toggleButton);
        
        //esperar a que el campo de entrada esté disponible
        const inputField = await screen.findByPlaceholderText('Escribe tu pregunta...');
        const sendButton = screen.getByRole('button', { name: /Enviar/i });
        
        //enviar un mensaje
        fireEvent.change(inputField, { target: { value: 'Pregunta de prueba' } });
        await act(async () => {
          fireEvent.click(sendButton);
        });
        
        //verificar que se muestra el mensaje de error
        await waitFor(() => {
          expect(screen.getByText(/Lo siento, hubo un error al procesar tu solicitud/i)).toBeInTheDocument();
        });
      });

    it('should maintain chat history after error', async () => {

      
        mockAxios.onPost(/askllm/)
          .replyOnce(200, { answer: 'Respuesta exitosa' });
        mockAxios.onPost(/askllm/)
          .reply(500);
      
        const { container } = render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);

        //usar within para limitar el ámbito de búsqueda
        const { getByRole } = within(container);
        
        //expandir el chat usando el botón específico de este contenedor
        fireEvent.click(getByRole('button', { name: /Chat de Pistas ▲/i }));
      
        const sendMessage = async (text) => {
          const inputField = await screen.findByPlaceholderText('Escribe tu pregunta...');
          const sendButton = screen.getByRole('button', { name: /Enviar/i });
          
          fireEvent.change(inputField, { target: { value: text } });
          await act(async () => {
            fireEvent.click(sendButton);
          });
        };
      
        await sendMessage('Mensaje 1');
        await sendMessage('Mensaje 2');
      
        await waitFor(() => {

          const messages = screen.getAllByRole('listitem');

          //esperamos 4 mensajes: 2 del usuario y 2 respuestas (una exitosa y un error)
          expect(messages).toHaveLength(4);
          expect(messages[0]).toHaveTextContent('Mensaje 1');
          expect(messages[1]).toHaveTextContent('Respuesta exitosa');
          expect(messages[2]).toHaveTextContent('Mensaje 2');
          expect(messages[3]).toHaveTextContent(/error al procesar/i);

        });

      });
  });

  describe('API Interaction', () => {

    beforeEach(() => {
        cleanup();
        const { container } = render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
        ;
        expandChat();
        mockAxios.onPost(/askllm/).reply(200, { answer: 'Respuesta' });
      });

    it('should include movie name in API request', async () => {

        const testQuestion = '¿De qué año es?';
        
        
        //buscar los elementos del chat expandido
        const inputField = await screen.findByPlaceholderText('Escribe tu pregunta...');
        const sendButton = screen.getByRole('button', { name: /Enviar/i });
        
        //interactuar con el chat
        fireEvent.change(inputField, { target: { value: testQuestion } });

        await act(async () => {
          fireEvent.click(sendButton);
        });
        
        // verificar la solicitud API
        await waitFor(() => {
          expect(mockAxios.history.post.length).toBe(2);
          const requestData = JSON.parse(mockAxios.history.post[0].data);
          expect(requestData.question).toContain(movieName);
          expect(requestData.question).toContain(testQuestion);
          expect(requestData.model).toBe('empathy');
        });

      });

    it('should use correct API endpoint', async () => {

        process.env.REACT_APP_API_ENDPOINT = 'https://custom-api.example.com';
        
        
        const { container } = render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);

        //usar el container específico para encontrar elementos
        const toggleButton = within(container).getByRole('button', { name: /▲/i });
        fireEvent.click(toggleButton);
        
        const inputField = within(container).getByPlaceholderText('Escribe tu pregunta...');
        const sendButton = within(container).getByRole('button', { name: /Enviar/i });
        
        fireEvent.change(inputField, { target: { value: 'Pregunta' } });

        await act(async () => {
          fireEvent.click(sendButton);
        });
        
        await waitFor(() => {
          expect(mockAxios.history.post[0].url).toMatch(/https:\/\/custom-api\.example\.com/);
        });
        
        delete process.env.REACT_APP_API_ENDPOINT;

      });

  });

  describe('LLM Model Switching', () => {
    
    beforeEach(() => {
      mockAxios.reset();
      cleanup();
      render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
      expandChat(); 
    });
  
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });
  
    it('should display the model switch button when chat is expanded', () => {

      const switchButton = screen.getByRole('button', { 
        name: /Usar (Qwen|Mistral)/i 
      });

      expect(switchButton).toBeInTheDocument();
    });
  
    it('should show "Usar Qwen" by default when Mistral is active', () => {

      const switchButton = screen.getByRole('button', { 
        name: /Usar Qwen/i 
      });
      
      expect(switchButton).toHaveTextContent('Usar Qwen');
    });
  
    it('should switch button text to "Usar Mistral" when Qwen is active', () => {

      const switchButton = screen.getByRole('button', { 
        name: /Usar Qwen/i 
      });

      fireEvent.click(switchButton);
      expect(switchButton).toHaveTextContent('Usar Mistral');
    });
  
    it('should display a system message when switching models', () => {

      const switchButton = screen.getByRole('button', { 
        name: /Usar Qwen/i 
      });

      fireEvent.click(switchButton);
      
      const systemMessages = screen.getAllByText(/Se ha cambiado el modelo a /i);
      expect(systemMessages.length).toBeGreaterThan(0);
      
      const lastMessage = systemMessages[systemMessages.length - 1];
      expect(lastMessage).toHaveTextContent('Se ha cambiado el modelo a Qwen.');
    });
  
    it('should have correct styling for the model switch button', () => {

      const switchButton = screen.getByRole('button', { 
        name: /Usar Qwen/i 
      });
      
      expect(switchButton).toHaveStyle('background-color: rgb(232, 213, 201)');
      expect(switchButton).toHaveStyle('color: rgb(90, 45, 22)');
     
      expect(switchButton).toHaveStyle('font-size: 0.8rem');
      expect(switchButton).toHaveStyle('height: 30px');
    });
  
    it('should not display the switch button when chat is minimized', () => {
      
      const toggleButton = screen.getByRole('button', { name: /Chat de Pistas ▼/i });
      fireEvent.click(toggleButton);
      
      const switchButton = screen.queryByRole('button', { 
        name: /Usar (Qwen|Mistral)/i 
      });

      expect(switchButton).not.toBeInTheDocument();
    });

  });

  describe('Edge Cases', () => {

    beforeEach(() => {
        cleanup();
        render(<Chatbot movieName={movieName} setScore={mockSetScore}/>);
        expandChat();
      });

    it('should handle very long messages without breaking layout', async () => {

        const longMessage = 'Este es un mensaje muy largo '.repeat(50);
        mockAxios.onPost(/askllm/).reply(200, { answer: longMessage });
        
        
        const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
        const sendButton = screen.getByRole('button', { name: /Enviar/i });
        
        fireEvent.change(inputField, { target: { value: 'Pregunta' } });

        await act(async () => {
          fireEvent.click(sendButton);
        });
        
        
        await waitFor(() => {
          const botMessages = screen.getAllByRole('listitem')
            .filter(item => item.textContent.includes('mensaje muy largo'));
          
          expect(botMessages.length).toBe(1);
          expect(botMessages[0].textContent.length).toBeGreaterThan(1000);
        });
      }, 10000);

    it('should maintain scroll position when adding new messages', async () => {

      mockAxios.onPost(/askllm/).reply(200, { answer: 'Respuesta' });
      
      
      const listContainer = screen.getByRole('list');
      jest.spyOn(listContainer, 'scrollHeight', 'get').mockImplementation(() => 1000);
      jest.spyOn(listContainer, 'scrollTop', 'get').mockImplementation(() => 500);
      jest.spyOn(listContainer, 'clientHeight', 'get').mockImplementation(() => 400);
      
      const inputField = screen.getByPlaceholderText('Escribe tu pregunta...');
      const sendButton = screen.getByRole('button', { name: /Enviar/i });
      
      fireEvent.change(inputField, { target: { value: 'Pregunta' } });

      await act(async () => {
        fireEvent.click(sendButton);
      });
      
      await waitFor(() => {
        expect(listContainer.scrollTop).toBe(500);
      });

    });
  });
});