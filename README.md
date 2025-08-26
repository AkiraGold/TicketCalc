# TicketCalc 🎫

A professional React-based ticket calculator application for managing ticket sales with dual currency support (CZK/EUR). Built with modern React patterns and a focus on performance and accessibility. 🐺✨

## ✨ Features

- **Dual Currency Support**: Switch between CZK or EUR for pricing
- **Smart Ticket Management**: Add, edit, and delete ticket types with custom pricing
- **Real-time Calculation**: Automatic total calculation and change calculation
- **Persistent Storage**: Data is saved to localStorage with memory fallback
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Accessibility First**: Full ARIA support and keyboard navigation
- **Performance Optimized**: Memoized calculations and debounced inputs
- **User Safety**: Confirmation dialogs for destructive actions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Yarn or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
yarn build
# or
npm run build
```

## 🎯 Usage

1. **Select Currency**: Choose between CZK or EUR
2. **Set Amount Received**: Enter the amount received from the customer
3. **Count Tickets**: Use the +/- buttons to count different ticket types
4. **View Totals**: See the total cost and amount to give back
5. **Manage Ticket Types**: Add, edit, or delete ticket types as needed

## 🛠️ Technical Features

- **Performance**: Memoized calculations and debounced inputs
- **Data Management**: Unique ID system with automatic migration
- **Input Validation**: Smart price formatting and real-time validation
- **Accessibility**: Full ARIA support and keyboard navigation
- **Storage**: localStorage with memory fallback

## 🎨 Technologies

- **React 18** - Modern UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

