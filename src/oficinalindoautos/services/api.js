const API_URL = 'http://localhost:3000';

export async function buscarOrdens() {
  try {
    const response = await fetch(
      `${API_URL}/ordens`
    );

    return await response.json();

  } catch (error) {
    console.log(error);
  }
}
