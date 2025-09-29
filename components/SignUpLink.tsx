import { APP_ROUTES } from '@/utils/app_routes'
import { Link, Typography } from '@mui/material'

const SignUpLink = () => {
  return (
    <Typography variant="body2" textAlign="center" mt={3}>
          Already have an account?{" "}
          <Link
            variant="body2"
            href={APP_ROUTES.LOGIN}
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Login here
          </Link>
        </Typography>
  )
}

export default SignUpLink