const allowCheckWords: string[] = [
    'js',
    'file',
    'files',
    'static',
    'public',
    'content',
    'script',
    'scripts',
    'javascript',
    'assets',
    'src',
    'lib',
    'dist',
];

const allowLoadWords: string[] = [
    'blog', 'noticias', 'articulos', 'recursos', 'documentacion', 'aprendizaje', 
    'guia', 'consejos', 'faq', 'ayuda', 'biblioteca', 'archivos', 'explorar', 
    'descubrir', 'historias', 'galeria', 'contenido', 'publicaciones', 'academia', 
    'apuntes', 'informes', 'investigacion', 'conocimiento', 'libros', 'revistas', 
    'podcast', 'videos', 'cursos', 'tutoriales', 'demostraciones', 'presentaciones', 
    'infografias', 'recetas', 'mapas', 'datos', 'estadisticas', 'experiencias', 
    'testimonios', 'entrevistas', 'historial', 'cronologia', 'biografias', 'perfil'
];

const allowSaveWords: string[] = [
    "data", "form", "forms", "submit", "contact",
    "feedback", "subscribe", "comment", "newsletter", "message",
    "feedback", "subscribe", "survey", "preferences", "unsubscribe"
];

export { allowCheckWords, allowLoadWords, allowSaveWords };