import React from 'react'

const colors = {
    primary: { main: '#101010', dark: '#000000', light: '#303030', hover: '#202020' },
    secondary: { main: '#FFFFFF', dark: '#E0E0E0', light: '#F8F8F8', hover: '#F0F0F0' },
    accent: { main: '#505050', light: '#D0D0D0', ultraLight: '#F5F5F5' },
    text: { primary: '#101010', secondary: '#505050', light: '#909090', onDark: '#E0E0E0' }
  };

const Footer = () => {
    return (
        <footer className="border-t py-4 px-6 text-center text-sm"
            style={{ backgroundColor: colors.secondary.main, borderColor: colors.accent.light, color: colors.text.secondary }}
        >
            <p>© 2025 IGROWBIG Backoffice. All rights reserved.</p>
        </footer>
    )
}

export default Footer