import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields (name, email, password)' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      return NextResponse.json({
        message: 'Account created successfully',
        _id: user.id,
        name: user.name,
        email: user.email,
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: 'Invalid user data' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Server error during signup', error: error.message },
      { status: 500 }
    );
  }
}
