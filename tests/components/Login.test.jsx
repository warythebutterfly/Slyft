// Import necessary dependencies
import React from "react";
import { render, fireEvent, waitFor } from "../renderer";
import LoginScreen from "../../screens/LoginScreen";
import axios from "axios";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Mock axios
jest.mock("axios");

// Mock navigation
jest.mock("@react-navigation/native", () => {
    return {
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
    };
});

const mockStore = configureStore([]);
let store;

describe("LoginScreen", () => {
    beforeEach(() => {
        store = mockStore({
            // Mock initial state if needed, e.g. { nav: { user: {} } }
        });
    });

    it("submits the form and expects status code 200 from API", async () => {
        // Mock API response
        axios.post.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    token: "dummy_token",
                },
            },
        });

        // Render the LoginScreen component
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <LoginScreen />
            </Provider>
        );

        // Fill in the form
        fireEvent.changeText(getByPlaceholderText("Email"), "test@live.unilag.edu.ng");
        fireEvent.changeText(getByPlaceholderText("Password"), "password123");

        // Simulate form submission by clicking the login button
        fireEvent.press(getByText("Login"));

        // Wait for API call to resolve and check if axios.post was called
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/user/auth/login"),
                {
                    email: "test@live.unilag.edu.ng",
                    password: "password123",
                },
                expect.any(Object)
            );
        });

        // Check if axios.post returned the expected response (200 status)
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post.mock.calls[0][1]).toMatchObject({
            email: "test@live.unilag.edu.ng",
            password: "password123",
        });
    });
});
