import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    Card,
    Paper,
    Chip,
    Avatar,
    useTheme,
    alpha,
    Fade,
    Grow,
    Slide,
} from '@mui/material';
import {
    Code,
    Quiz,
    TrendingUp,
    School,
    Work,
    CheckCircle,
    Star,
    Telegram,
    PlayArrow,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthHeader } from './auth';

const LandingPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const scrollToPricing = () => {
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const features = [
        {
            icon: <Quiz />,
            title: "150+ Amaliy Savollar",
            description: "Real dunyodagi vaziyatlarga asoslangan savollar"
        },
        {
            icon: <Code />,
            title: "Turli Formatlar",
            description: "MCQ, True/False, Kod Yozish, Xatoliklarni Topish"
        },
        {
            icon: <TrendingUp />,
            title: "Progress Tracking",
            description: "Qayerda qolganingizni kuzatib boring"
        }
    ];

    const topics = [
        "OOP Principles",
        "LINQ",
        "Delegates & Events",
        "ASP.NET Core",
        "Exception Handling",
        "Entity Framework Core",
        "Async/Await",
        "Design Patterns"
    ];

    const testimonials = [
        {
            text: "Savollar amaliy va intervyularda juda qo'l keladi. Har bir mavzu bo'yicha chuqur tushuncha beradi.",
            author: "Junior Developer",
            rating: 5
        },
        {
            text: "Har kuni 15 daqiqa vaqt ajratib, o'zimni sinab ko'raman. Bilimlarim sezilarli darajada yaxshilandi.",
            author: "Middle Developer",
            rating: 5
        }
    ];

    return (
        <Box>
            {/* Authentication Header */}
            <AuthHeader />

            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated background elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: alpha(theme.palette.primary.main, 0.05),
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' }
                        }
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        right: '15%',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: alpha(theme.palette.secondary.main, 0.05),
                        animation: 'float 4s ease-in-out infinite 2s',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-15px)' }
                        }
                    }}
                />
                
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in={loaded} timeout={400}>
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                                mb: 3,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: 'none'
                            }}
                        >
                            C# va .NET guru bo'ling
                        </Typography>
                    </Fade>
                    
                    <Fade in={loaded} timeout={600}>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                lineHeight: 1.6
                            }}
                        >
                            Ishlaysizmi yoki o'rganasizmi — .NET QBank siz uchun. Har kuni bilimlaringizni sinang!
                        </Typography>
                    </Fade>
                    
                    <Slide direction="up" in={loaded} timeout={800}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={scrollToPricing}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    borderRadius: 3,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                                    }
                                }}
                            >
                                Obuna bo'lish
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<PlayArrow />}
                                onClick={() => navigate('/collections')}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    borderRadius: 3,
                                    borderWidth: 2,
                                    transition: 'all 0.3s ease-in-out',
                                                                            '&:hover': {
                                            borderWidth: 2,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                        }
                                }}
                            >
                                Bepul Sinab Ko'ring
                            </Button>
                        </Box>
                    </Slide>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Fade in={loaded} timeout={400}>
                    <Typography
                        variant="h3"
                        component="h2"
                        textAlign="center"
                        gutterBottom
                        sx={{ mb: 6, fontWeight: 'bold' }}
                    >
                        .NET QBank nima?
                    </Typography>
                </Fade>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 4 
                }}>
                    {features.map((feature, index) => (
                        <Grow
                            key={index}
                            in={loaded}
                            timeout={600 + (index * 100)}
                            style={{ transformOrigin: '0 0 0' }}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    p: 4,
                                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 1)})`,
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    borderRadius: 3,
                                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        transform: 'scaleX(0)',
                                        transformOrigin: 'left',
                                        transition: 'transform 0.3s ease-in-out'
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
                                        '&::before': {
                                            transform: 'scaleX(1)'
                                        }
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3,
                                        color: theme.palette.primary.main,
                                        fontSize: '2rem',
                                        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.1)}`,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`
                                        }
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography 
                                    variant="h6" 
                                    gutterBottom 
                                    fontWeight="bold"
                                    sx={{ 
                                        mb: 2,
                                        background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography 
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.6 }}
                                >
                                    {feature.description}
                                </Typography>
                            </Card>
                        </Grow>
                    ))}
                </Box>

                {/* Additional Features */}
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Qo'shimcha imkoniyatlar:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                        <Chip icon={<CheckCircle />} label="Haftalik yangilanish" color="primary" />
                        <Chip icon={<CheckCircle />} label="Instant tahlil" color="primary" />
                        <Chip icon={<CheckCircle />} label="Mavzu bo'yicha kategoriya" color="primary" />
                        <Chip icon={<CheckCircle />} label="Progress tracking" color="primary" />
                    </Box>
                </Box>
            </Container>

            {/* Target Audience */}
            <Box sx={{ backgroundColor: alpha(theme.palette.grey[500], 0.05), py: 8 }}>
                <Container maxWidth="lg">
                    <Fade in={loaded} timeout={1000}>
                        <Typography
                            variant="h3"
                            component="h2"
                            textAlign="center"
                            gutterBottom
                            sx={{ mb: 6, fontWeight: 'bold' }}
                        >
                            Kim uchun mo'ljallangan?
                        </Typography>
                    </Fade>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 4 
                    }}>
                        <Slide direction="right" in={loaded} timeout={600}>
                            <Paper
                                sx={{
                                    p: 5,
                                    textAlign: 'center',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderRadius: 3,
                                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 1)})`,
                                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        transform: 'scaleX(0)',
                                        transformOrigin: 'left',
                                        transition: 'transform 0.3s ease-in-out'
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
                                        '&::before': {
                                            transform: 'scaleX(1)'
                                        }
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                                        mb: 3,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.1) rotate(5deg)'
                                        }
                                    }}
                                >
                                    <School sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                                </Box>
                                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                                    Studentlar va Internlar
                                </Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    C# asoslarini mustahkamlashni istagan va amaliy tajriba orttirmoqchi bo'lgan o'quvchilar uchun
                                </Typography>
                            </Paper>
                        </Slide>
                        <Slide direction="left" in={loaded} timeout={600}>
                            <Paper
                                sx={{
                                    p: 5,
                                    textAlign: 'center',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderRadius: 3,
                                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 1)})`,
                                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                                        transform: 'scaleX(0)',
                                        transformOrigin: 'right',
                                        transition: 'transform 0.3s ease-in-out'
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
                                        '&::before': {
                                            transform: 'scaleX(1)'
                                        }
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                                        mb: 3,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.1) rotate(-5deg)'
                                        }
                                    }}
                                >
                                    <Work sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                                </Box>
                                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                                    Professional Dasturchilar
                                </Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    Doimiy ravishda o'z bilimlarini yangilab turish va intervyularga tayyorlanish istagan mutaxassislar
                                </Typography>
                            </Paper>
                        </Slide>
                    </Box>
                </Container>
            </Box>

            {/* Topics */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    textAlign="center"
                    gutterBottom
                    sx={{ mb: 6, fontWeight: 'bold' }}
                >
                    Mavzular
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                    {topics.map((topic, index) => (
                        <Chip
                            key={index}
                            label={topic}
                            variant="outlined"
                            size="medium"
                            sx={{
                                fontSize: '1rem',
                                py: 3,
                                px: 2,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        />
                    ))}
                </Box>
            </Container>

            {/* Pricing */}
            <Box id="pricing-section" sx={{ backgroundColor: alpha(theme.palette.grey[500], 0.05), py: 8 }}>
                <Container maxWidth="lg">
                    <Fade in={loaded} timeout={400}>
                        <Typography
                            variant="h3"
                            component="h2"
                            textAlign="center"
                            gutterBottom
                            sx={{ mb: 6, fontWeight: 'bold' }}
                        >
                            Narxlar
                        </Typography>
                    </Fade>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4,
                        flexWrap: 'wrap'
                    }}>
                        <Grow in={loaded} timeout={600}>
                            <Card
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    height: '100%',
                                    position: 'relative',
                                    minWidth: { xs: '100%', sm: '280px' },
                                    maxWidth: '320px',
                                    borderRadius: 3,
                                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 1)})`,
                                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`
                                    }
                                }}
                            >
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Oylik
                                </Typography>
                                <Typography variant="h3" color="primary" gutterBottom>
                                    1K
                                    <Typography component="span" variant="h6" color="text.secondary">
                                        {' '}so'm
                                    </Typography>
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                                    Barcha savollar va yangilanishlarga kirish
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        borderWidth: 2,
                                        py: 1.5,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            borderWidth: 2,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`
                                        }
                                    }}
                                >
                                    Tanlash
                                </Button>
                            </Card>
                        </Grow>
                        <Grow in={loaded} timeout={700}>
                            <Card
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    height: '100%',
                                    position: 'relative',
                                    border: `2px solid ${theme.palette.primary.main}`,
                                    transform: 'scale(1.05)',
                                    zIndex: 1,
                                    minWidth: { xs: '100%', sm: '280px' },
                                    maxWidth: '320px',
                                    borderRadius: 3,
                                    background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.background.paper, 1)})`,
                                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'scale(1.08) translateY(-8px)',
                                        boxShadow: `0 25px 70px ${alpha(theme.palette.primary.main, 0.25)}`
                                    }
                                }}
                            >
                                <Chip
                                    label="Eng Mashhur"
                                    color="primary"
                                    sx={{
                                        position: 'absolute',
                                        top: -12,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontWeight: 'bold',
                                        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`
                                    }}
                                />
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Umrbod
                                </Typography>
                                <Typography variant="h3" color="primary" gutterBottom>
                                    1🍋
                                    <Typography component="span" variant="h6" color="text.secondary">
                                        {' '}so'm
                                    </Typography>
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                                    Barcha savollar + kelajakdagi yangilanishlar
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                    <Chip
                                        icon={<Star />}
                                        label="WahidUstoz bilan mock interview"
                                        color="secondary"
                                        size="small"
                                        sx={{
                                            fontWeight: 'medium',
                                            boxShadow: `0 2px 10px ${alpha(theme.palette.secondary.main, 0.2)}`
                                        }}
                                    />
                                </Box>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                                        }
                                    }}
                                >
                                    Tanlash
                                </Button>
                            </Card>
                        </Grow>
                    </Box>
                </Container>
            </Box>

            {/* Testimonials */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Fade in={loaded} timeout={400}>
                    <Typography
                        variant="h3"
                        component="h2"
                        textAlign="center"
                        gutterBottom
                        sx={{ mb: 6, fontWeight: 'bold' }}
                    >
                        Foydalanuvchilar fikri
                    </Typography>
                </Fade>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 4 
                }}>
                    {testimonials.map((testimonial, index) => (
                        <Grow 
                            key={index} 
                            in={loaded} 
                            timeout={600 + (index * 150)}
                            style={{ transformOrigin: '0 0 0' }}
                        >
                            <Card 
                                sx={{ 
                                    p: 4, 
                                    height: '100%',
                                    borderRadius: 3,
                                    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 1)})`,
                                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', mb: 3, justifyContent: 'center' }}>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            sx={{ 
                                                color: '#ffc107', 
                                                fontSize: 24,
                                                filter: 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3))',
                                                animation: `starTwinkle 2s ease-in-out infinite ${i * 0.2}s`,
                                                '@keyframes starTwinkle': {
                                                    '0%, 100%': { transform: 'scale(1)' },
                                                    '50%': { transform: 'scale(1.1)' }
                                                }
                                            }} 
                                        />
                                    ))}
                                </Box>
                                <Box sx={{ position: 'relative', px: 3 }}>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            mb: 3, 
                                            fontStyle: 'italic',
                                            fontSize: '1.1rem',
                                            lineHeight: 1.6,
                                            textAlign: 'center'
                                        }}
                                    >
                                        "{testimonial.text}"
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            mr: 2,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        {testimonial.author.charAt(0)}
                                    </Avatar>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ fontWeight: 'medium' }}
                                    >
                                        {testimonial.author}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grow>
                    ))}
                </Box>
            </Container>

            {/* Final CTA */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, #1a1a1a 0%, #000000 100%)`,
                    color: 'white',
                    py: 8,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Subtle background pattern */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha('#ffffff', 0.02)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha('#ffffff', 0.02)} 0%, transparent 50%)`,
                        pointerEvents: 'none'
                    }}
                />
                
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Bugun o'zingizni sinab ko'ring!
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.8, color: '#e0e0e0' }}>
                        Bilimlaringizni mustahkamlash uchun hoziroq boshlang
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Telegram />}
                            onClick={() => window.open('https://t.me/ustozwahid', '_blank')}
                            sx={{
                                backgroundColor: 'white',
                                color: '#1a1a1a',
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 30px rgba(255, 255, 255, 0.15)'
                                }
                            }}
                        >
                            Telegram orqali bog'lanish
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => window.open('https://t.me/+o6inuSfn_xc0MTgy', '_blank')}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                borderRadius: 2,
                                borderWidth: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: alpha('#fff', 0.1),
                                    transform: 'translateY(-2px)',
                                    borderWidth: 2
                                }
                            }}
                        >
                            Ro'yxatdan o'tish
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage; 