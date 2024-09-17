import React, { Component } from "react";
import { View, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error:", error, "Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text style={tw`text-center text-xl py-5`}>Something went wrong.</Text>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
