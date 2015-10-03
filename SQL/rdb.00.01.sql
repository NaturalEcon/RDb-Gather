create table [Upc] (
	Id int primary key identity,
	Upc varchar(13) unique,
	Name varchar(4000)
)
create table [UpcLog] (
	Id int primary key identity,
	Upc varchar(13),
	UserId int,
	[DateTime] datetime
)

create table [RDbUser] (
	Id int primary key identity(1,2),
	Name varchar(60),
	Collections int
)

alter table [UpcLog]
add constraint FK_UpcLog_RDbUser foreign key (Userid)
	references [RDbUser] (Id)