import { RenderOptions, render, waitFor, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";

/** Wraps any component which will be rendered by RNTL render function in all the providers */
const AllProviders = ({ children }) => {
    return <NavigationContainer>{children}</NavigationContainer>;
};

const customender = (ui, options) => render(ui, { wrapper: AllProviders, ...options });
export * from "@testing-library/react-native";
export { customender as render, waitFor, fireEvent };
