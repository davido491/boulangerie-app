import React from 'react';

function ErrorComponent({ data }) {
  // Vérifiez si data est un objet et convertissez-le en chaîne de caractères si nécessaire
  const displayData = typeof data === 'object' ? JSON.stringify(data) : data;

  return (
    <div>
      <p>{displayData}</p>
    </div>
  );
}

export default ErrorComponent;
